class StorageService {
  private storage: Storage

  constructor(storageType: 'local' | 'session' = 'local') {
    this.storage = storageType === 'local' ? localStorage : sessionStorage
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key)
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value)
  }

  removeItem(key: string): void {
    this.storage.removeItem(key)
  }

  clear(): void {
    this.storage.clear()
  }
}

export const storageService = new StorageService('local')
