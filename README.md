# Instalasi

Clone repository ini dengan perintah berikut:.\
`git clone https://github.com/JavierZam/apipasien`

Masuk ke dalam direktori repository dengan perintah:.\
`cd apipasien`

Jalankan perintah berikut untuk menginstall dependency:.\
`npm install`

Buat file firebaseConfig.js yang berisikan 

```
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
  measurementId: 'YOUR_MEASUREMENT_ID',
};

module.exports = firebaseConfig;
```

Pastikan untuk mengganti your-api-key, your-auth-domain, your-project-id, your-storage-bucket, 
your-messaging-sender-id, your-app-id dan your_measurement_id dengan nilai yang sesuai dari akun Firebase Anda.

# Endpoints

| Method | Endpoint                   | Handler                                  |
| ------ | ---------------------------| ---------------------------------------- |
| GET    | /patients                  | getPatients()                            |
| GET    | /patients/:id              | getPatientById()                         |
| POST   | /patients                  | createPatient()                          |
| PUT    | /patients/:id              | updatePatient()                          |
| DELETE | /patients/:id              | deletePatient()                          |
| POST   | /patients/:id/drugs        | addDrugHistoryToPatient()                |
| GET    | /drugs                     | getDrugs()                               |
| GET    | /patients/:id/drugHistory  | getdrugHistory()                         |

# GET /patients
Mengambil Semua Data Pasien dari database.

Response:

Success (200):
```json
{
  "data": [
    {
      "id": "abc123",
      "nama": "John Doe",
      "umur": 30,
      "alamat": "Jl. Contoh Alamat",
      "berat": 70.5,
      "tensi": "120/80"
    },
    {
      "id": "def456",
      "nama": "Jane Smith",
      "umur": 25,
      "alamat": "Jl. Contoh Alamat Lain",
      "berat": 65.2,
      "tensi": "120/80"
    }
  ],
  "message": "Data pasien berhasil diambil",
  "code_respon": 200
}

```
Error (500):
```json
{
  "error": "Terjadi kesalahan saat mengambil data pasien",
  "message": "Terjadi kesalahan saat mengambil data pasien",
  "code_respon": 500
}
```

# GET /patients/:id
Mengambil Detail Pasien Berdasarkan ID.

Response:

Success (200):
```json
{
  "data": {
    "id": "abc123",
    "nama": "John Doe",
    "umur": 30,
    "alamat": "Jl. Contoh Alamat",
    "berat": 70.5,
    "tensi": "120/80"
  },
  "message": "Data pasien berhasil ditemukan",
  "code_respon": 200
}
```
Error (404):
```json
{
  "error": "Patient not found",
  "message": "Pasien tidak ditemukan",
  "code_respon": 404
}
```
Error (500):
```json
{
  "error": "Terjadi kesalahan saat mengambil detail pasien",
  "message": "Terjadi kesalahan saat mengambil detail pasien",
  "code_respon": 500
}
```

# POST /patients

Request Body:
```json
{
  "nama": "John Doe",
  "umur": 30,
  "alamat": "Jl. Contoh Alamat",
  "berat": 70.5,
  "tensi": "120/80"
}
```
Response:
Success (200):
```json
{
  "data": {
    "id": "abc123",
    "nama": "John Doe",
    "umur": 30,
    "alamat": "Jl. Contoh Alamat",
    "berat": 70.5,
    "tensi": "120/80"
  },
  "message": "Pasien berhasil ditambahkan",
  "code_respon": 200
}
```

Error (400):
```json
{
  "error": "Data pasien tidak valid",
  "message": "Data pasien tidak valid",
  "code_respon": 400
}
```
Error (400):
```json
{
  "error": "Data pasien sudah ada",
  "message": "Gagal menambahkan pasien",
  "code_respon": 400
}
```
Error (500):
```json
{
  "error": "Terjadi kesalahan saat menambahkan pasien",
  "message": "Terjadi kesalahan saat menambahkan pasien",
  "code_respon": 500
}
```

# PUT /patients/:id
Memperbarui Detail Pasien Berdasarkan ID.

Request Body:
```json
{
  "nama": "John Doe",
  "umur": 35,
  "alamat": "Jl. Contoh Alamat Baru",
  "berat": 75.2,
  "tensi": "120/80"
}
```

Response:

Success (200):
```json
{
  "data": {},
  "message": "Data pasien berhasil diperbarui",
  "code_respon": 200
}
```

Error (400):
```json
{
  "error": "Data pasien tidak valid",
  "message": "Data pasien tidak valid",
  "code_respon": 400
}
```

Error (404):
```json
{
  "error": "Patient not found",
  "message": "Pasien tidak ditemukan",
  "code_respon": 404
}
```

Error (500):
```json
{
  "error": "Terjadi kesalahan saat memperbarui detail pasien",
  "message": "Terjadi kesalahan saat memperbarui detail pasien",
  "code_respon": 500
}
```

# DELETE /patients/:id
Menghapus Data Pasien Berdasarkan ID.

Response:

Success (200):
```json
{
  "data": {},
  "message": "Data pasien berhasil dihapus",
  "code_respon": 200
}
```

Error (404):
```json
{
  "error": "Patient not found",
  "message": "Pasien tidak ditemukan",
  "code_respon": 404
}
```

Error (500):
```json
{
  "error": "Terjadi kesalahan saat menghapus data pasien",
  "message": "Terjadi kesalahan saat menghapus data pasien",
  "code_respon": 500
}
```

# POST /patients/:id/drugs
Menambahkan history obat ke pasien berdasarkan ID pasien dan nama obat.

Request Body:

```json
{
  "nama": "Obat Contoh",
  "stok": 10
}
```

Response:

Success (200):
```json
{
  "data": {
    "id": "idObat",
    "nama": "Obat Contoh",
    "stok": 10
  },
  "message": "History obat berhasil ditambahkan",
  "code_respon": 200
}
```

Error (400):
```json
{
  "error": "Obat tidak ditemukan",
  "message": "Gagal menambahkan history obat",
  "code_respon": 400
}
```

Error (400):
```json
{
  "error": "Stok obat tidak cukup",
  "message": "Gagal menambahkan history obat",
  "code_respon": 400
}
```
Error (500):
```json
{
  "error": "Terjadi kesalahan saat menambahkan history obat",
  "message": "Terjadi kesalahan saat menambahkan history obat",
  "code_respon": 500
}
```

# GET /drugs
Mengambil semua data obat dari database.

Response:

Success (200):

```json
{
  "data": [
    {
      "id": "idObat",
      "nama": "Obat Contoh",
      "stok": 50
    },
    {
      "id": "idObat2",
      "nama": "Obat Contoh Lain",
      "stok": 100
    }
  ],
  "message": "Data obat berhasil diambil",
  "code_respon": 200
}
```

Error (500):
```json
{
  "error": "Terjadi kesalahan saat mengambil data obat",
  "message": "Terjadi kesalahan saat mengambil data obat",
  "code_respon": 500
}
```
# GET /patients/:id/drugHistory
Mengambil Semua History Obat Pasien Berdasarkan ID.

Response:

Success (200):
```json
{
  "data": [
    {
      "id": "abc123",
      "nama": "Paracetamol",
      "stok": 5
    },
    {
      "id": "def456",
      "nama": "Antibiotik",
      "stok": 3
    }
  ],
  "message": "History obat berhasil diambil",
  "code_respon": 200
}
```

Error (500):
```json
{
  "error": "Terjadi kesalahan saat mengambil history obat",
  "message": "Terjadi kesalahan saat mengambil history obat",
  "code_respon": 500
}
```
