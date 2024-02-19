class HeapNode {
  constructor(item, priority) {
    this.item = item;
    this.priority = priority;
  }
}

class MinHeap {
  constructor() {
    this.heap = [];
  }

  heapify_up(index) {
    let parentIndex = Math.floor((index - 1) / 2);
    while (
      index > 0 &&
      this.heap[index].priority < this.heap[parentIndex].priority
    ) {
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      index = parentIndex;
      parentIndex = Math.floor((index - 1) / 2);
    }
  }

  heapify_down(index) {
    let smallest = index;
    const leftChild = 2 * index + 1;
    const rightChild = 2 * index + 2;

    if (
      leftChild < this.heap.length &&
      this.heap[leftChild].priority < this.heap[smallest].priority
    ) {
      smallest = leftChild;
    }

    if (
      rightChild < this.heap.length &&
      this.heap[rightChild].priority < this.heap[smallest].priority
    ) {
      smallest = rightChild;
    }

    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      this.heapify_down(smallest);
    }
  }

  startHeap(size) {
    this.heap = new Array(size);
  }

  insert(item, priority) {
    this.heap.push(new HeapNode(item, priority));
    this.heapify_up(this.heap.length - 1);
  }

  findMin() {
    if (this.heap.length === 0) {
      return null;
    }
    return this.heap[0].item;
  }

  delete(index) {
    if (index < 0 || index >= this.heap.length) {
      throw new Error("Invalid index");
    }

    [this.heap[index], this.heap[this.heap.length - 1]] = [
      this.heap[this.heap.length - 1],
      this.heap[index],
    ];
    this.heap.pop();

    if (index < this.heap.length) {
      this.heapify_down(index);
    }
  }

  extractMin() {
    if (this.heap.length === 0) {
      return null;
    }

    const min = this.heap[0].item;
    this.delete(0);
    return min;
  }

  delete(item) {
    const index = this.heap.findIndex((element) => element.item === item);
    if (index === -1) {
      throw new Error("Item not found");
    }
    this.delete(index);
  }

  changePriority(item, newPriority) {
    const index = this.heap.findIndex((element) => element.item === item);
    if (index === -1) {
      throw new Error("Item not found");
    }
    this.heap[index].priority = newPriority;
    this.heapify_up(index);
    this.heapify_down(index);
  }
}

//add random numbers to the heap with random priorities
const minHeap = new MinHeap();
for (let i = 0; i < 10; i++) {
  minHeap.insert(i, Math.floor(Math.random() * 100));
}

//print the heap
console.log(minHeap.heap);
