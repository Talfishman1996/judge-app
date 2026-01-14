// IndexedDB Service for JUDGE App - Case History Persistence

import type { VerdictResponse, Evidence } from './gemini'

export interface SavedCase {
  id: string
  timestamp: number
  evidence: Evidence
  verdict: VerdictResponse
  partyAName: string
  partyBName: string
}

const DB_NAME = 'judge_app'
const DB_VERSION = 1
const STORE_NAME = 'cases'

let db: IDBDatabase | null = null

export async function initDB(): Promise<IDBDatabase> {
  if (db) return db

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => {
      console.error('Failed to open database:', request.error)
      reject(request.error)
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // Create cases store
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

export async function saveCase(
  evidence: Evidence,
  verdict: VerdictResponse
): Promise<string> {
  const database = await initDB()

  const caseData: SavedCase = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    evidence,
    verdict,
    partyAName: evidence.type === 'text' ? evidence.partyA : 'Party A',
    partyBName: evidence.type === 'text' ? evidence.partyB : 'Party B'
  }

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.add(caseData)

    request.onsuccess = () => resolve(caseData.id)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllCases(): Promise<SavedCase[]> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('timestamp')
    const request = index.getAll()

    request.onsuccess = () => {
      // Return in reverse chronological order
      const cases = request.result as SavedCase[]
      resolve(cases.reverse())
    }
    request.onerror = () => reject(request.error)
  })
}

export async function getCase(id: string): Promise<SavedCase | null> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(id)

    request.onsuccess = () => resolve(request.result || null)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteCase(id: string): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function clearAllCases(): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getCaseCount(): Promise<number> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.count()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

// Temporary evidence storage (avoids localStorage quota issues on iOS)
const TEMP_EVIDENCE_KEY = 'temp_evidence'

export async function saveTempEvidence(evidence: Evidence): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)

    const request = store.put({
      id: TEMP_EVIDENCE_KEY,
      timestamp: Date.now(),
      evidence,
      verdict: null,
      partyAName: '',
      partyBName: ''
    })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export async function getTempEvidence(): Promise<Evidence | null> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(TEMP_EVIDENCE_KEY)

    request.onsuccess = () => {
      const result = request.result
      resolve(result?.evidence || null)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function clearTempEvidence(): Promise<void> {
  const database = await initDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(TEMP_EVIDENCE_KEY)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
