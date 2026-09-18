import { ConversionRequest, ConversionResponse } from './converter.worker';

type TaskResolve = (res: ConversionResponse) => void;

interface QueuedTask {
  request: ConversionRequest;
  resolve: TaskResolve;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private idleWorkers: Worker[] = [];
  private taskQueue: QueuedTask[] = [];
  private activeTasks: Map<Worker, string> = new Map();

  constructor(private poolSize: number = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4) {
    if (typeof window !== 'undefined') {
      for (let i = 0; i < this.poolSize; i++) {
        const worker = new Worker(new URL('./converter.worker.ts', import.meta.url));
        worker.onmessage = this.handleMessage.bind(this, worker);
        this.workers.push(worker);
        this.idleWorkers.push(worker);
      }
    }
  }

  private handleMessage(worker: Worker, event: MessageEvent<ConversionResponse>) {
    const response = event.data;
    const resolve = this.getResolveCallback(response.id);
    
    if (resolve) {
      resolve(response);
    }

    // Free the worker
    this.activeTasks.delete(worker);
    this.idleWorkers.push(worker);

    // Process next task
    this.processQueue();
  }

  // Not highly optimal, but reliable for small pools
  private resolveCallbacks: Map<string, TaskResolve> = new Map();

  private getResolveCallback(id: string): TaskResolve | undefined {
    const cb = this.resolveCallbacks.get(id);
    this.resolveCallbacks.delete(id);
    return cb;
  }

  public enqueueTask(request: ConversionRequest): Promise<ConversionResponse> {
    return new Promise((resolve) => {
      this.resolveCallbacks.set(request.id, resolve);
      this.taskQueue.push({ request, resolve });
      this.processQueue();
    });
  }

  private processQueue() {
    if (this.taskQueue.length === 0 || this.idleWorkers.length === 0) {
      return;
    }

    const worker = this.idleWorkers.pop()!;
    const task = this.taskQueue.shift()!;
    
    this.activeTasks.set(worker, task.request.id);
    worker.postMessage(task.request);
  }

  public destroy() {
    this.workers.forEach(w => w.terminate());
    this.workers = [];
    this.idleWorkers = [];
    this.taskQueue = [];
    this.resolveCallbacks.clear();
  }
}
