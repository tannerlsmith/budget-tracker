// connects db
let db; 
// establishes connection to IndexedDB database --name / version 1.
const request = indexedDB.open('budget', 1);

request.onupgradeneeded = (transaction) => {
    var data = transaction.target.result
    data.createObjectStore('pending', {autoIncrement: true})
}

request.onsuccess = (transaction) => {
    db = transaction.target.result
    if (navigator.onLine) {
        addtoDatabase()
    }
}

request.onerror = (event) => {
    console.log(event.target.errorCode)
}

// 
function addtoDatabase() {
    const transactions = db.transaction(['pending'], 'rewrite')
    const store = transactions.objectStore('pending')
    const getAll = store.getAll()
    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST', 
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain',
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                return response.json
            }).then(() => {
                const transactions = db.transaction(['pending'], 'rewrite')
                const store = transactions.objectStore('pending')
                store.clear()
            })
        } 
    }
}

// 
function saveRecord(trade) {
    const transaction = db.transaction(['pending'], 'rewrite')
    const store = transaction.objectStore('pending')
    store.add(trade)
}

window.addEventListener('online', addtoDatabase)