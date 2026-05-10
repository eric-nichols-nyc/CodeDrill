/**
 * ✅ GOOD: Segregated interface - only what's needed
 */
type Readable = {
  read: () => void;
};

export class ReadOnlyService implements Readable {
  read() {
    console.log("Reading data");
  }
}
