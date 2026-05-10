/**
 * ✅ GOOD: Implements multiple segregated interfaces
 */
type Readable = {
  read: () => void;
};

type Writable = {
  create: () => void;
  update: () => void;
  delete: () => void;
};

export class FullService implements Readable, Writable {
  read() {
    console.log("Reading data");
  }

  create() {
    console.log("Creating data");
  }

  update() {
    console.log("Updating data");
  }

  delete() {
    console.log("Deleting data");
  }
}
