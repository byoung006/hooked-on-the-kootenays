import express from 'express'
import fs from 'fs'
import Papa from 'papaparse' // Import PapaParse
const app = express()
const port = 3000 // Choose a port

app.use(express.json()) // Parse JSON requests

app.post('/update-csv', (req, res) => {
  const newData = req.body // Data from the frontend
  const csvFilePath = 'FishingSpotsKootenays.csv' // Path to your CSV file

  console.log('entry into backend')
  fs.readFile(csvFilePath, 'utf8', (err, csvData) => {
    if (err) {
      console.error(err)
      return res.status(500).send('Error reading CSV file.')
    }

    Papa.parse(csvData, {
      header: true,
      complete: (results) => {
        const updatedData = [...results.data, newData] // Add new data
        const updatedCsv = Papa.unparse(updatedData)

        fs.writeFile(csvFilePath, updatedCsv, 'utf8', (err) => {
          if (err) {
            console.error(err)
            return res.status(500).send('Error writing CSV file.')
          }
          res.send('CSV file updated successfully.')
        })
      },
    })
  })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
