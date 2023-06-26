const express = require('express');
const cors = require('cors');
const firebase = require('firebase');
const Joi = require('joi');
require('firebase/firestore');
const firebaseConfig = require('../firebaseConfig');

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const app = express();
app.use(cors());
app.use(express.json());

// Mengambil semua data pasien
app.get('/patients', async (req, res) => {
  try {
    const snapshot = await db.collection('patients').get();
    const patients = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      data: patients,
      message: 'Data pasien berhasil diambil',
      code_respon: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Terjadi kesalahan saat mengambil data pasien',
      code_respon: 500,
    });
  }
});

// Mendapatkan detail pasien berdasarkan ID
app.get('/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const patientDoc = await db.collection('patients').doc(id).get();
    if (!patientDoc.exists) {
      res.status(404).json({
        error: 'Patient not found',
        message: 'Pasien tidak ditemukan',
        code_respon: 404,
      });
    } else {
      const patientData = patientDoc.data();
      res.json({
        data: {
          id: patientDoc.id,
          ...patientData,
        },
        message: 'Data pasien berhasil ditemukan',
        code_respon: 200,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Terjadi kesalahan saat mengambil detail pasien',
      code_respon: 500,
    });
  }
});

// Menambahkan pasien baru
app.post('/patients', async (req, res) => {
  try {
    const { error } = validatePatient(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        message: 'Data pasien tidak valid',
        code_respon: 400,
      });
    }

    const { nama, umur, alamat, berat, tensi } = req.body;

    const existingPatient = await db.collection('patients').where('nama', '==', nama).get();
    if (!existingPatient.empty) {
      return res.status(400).json({
        error: 'Data pasien sudah ada',
        message: 'Gagal menambahkan pasien',
        code_respon: 400,
      });
    }

    const newPatient = {
      nama,
      umur,
      alamat,
      berat: parseFloat(berat),
      tensi,
    };
    const docRef = await db.collection('patients').add(newPatient);
    res.json({
      data: {
        id: docRef.id,
        ...newPatient,
      },
      message: 'Pasien berhasil ditambahkan',
      code_respon: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Terjadi kesalahan saat menambahkan pasien',
      code_respon: 500,
    });
  }
});

// Memperbarui detail pasien berdasarkan ID
app.put('/patients/:id', async (req, res) => {
  try {
    const { error } = validatePatient(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
        message: 'Data pasien tidak valid',
        code_respon: 400,
      });
    }

    const { id } = req.params;
    const { nama, umur, alamat, berat, tensi } = req.body;
    const updatedPatient = {
      nama,
      umur,
      alamat,
      berat: parseFloat(berat),
      tensi,
    };
    await db.collection('patients').doc(id).set(updatedPatient, { merge: true });
    res.json({
      data: {},
      message: 'Data pasien berhasil diperbarui',
      code_respon: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Terjadi kesalahan saat memperbarui detail pasien',
      code_respon: 500,
    });
  }
});

// Menghapus data pasien berdasarkan ID
app.delete('/patients/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('patients').doc(id).delete();
    res.json({
      data: {},
      message: 'Data pasien berhasil dihapus',
      code_respon: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Terjadi kesalahan saat menghapus data pasien',
      code_respon: 500,
    });
  }
});

app.post('/patients/:id/drugs', async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, stok } = req.body;

    // Cari obat di collection 'drugs'
    const drugSnapshot = await db.collection('drugs').where('nama', '==', nama).get();

    if (drugSnapshot.empty) {
      return res.status(400).json({
        error: 'Obat tidak ditemukan',
        message: 'Gagal menambahkan history obat',
        code_respon: 400,
      });
    }

    let drugDoc = drugSnapshot.docs[0];

    // Periksa apakah stok cukup
    if (drugDoc.data().stok < stok) {
      return res.status(400).json({
        error: 'Stok obat tidak cukup',
        message: 'Gagal menambahkan history obat',
        code_respon: 400,
      });
    }

    // Kurangi stok obat
    await db
      .collection('drugs')
      .doc(drugDoc.id)
      .update({ stok: drugDoc.data().stok - stok });

    // Tambahkan history obat ke pasien
    const drugHistory = { nama, stok };
    await db.collection('patients').doc(id).collection('drugHistory').add(drugHistory);

    res.json({
      data: {
        id: drugDoc.id,
        ...drugHistory,
      },
      message: 'History obat berhasil ditambahkan',
      code_respon: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Terjadi kesalahan saat menambahkan history obat',
      code_respon: 500,
    });
  }
});

app.get('/drugs', async (req, res) => {
  try {
    const snapshot = await db.collection('drugs').get();
    const drugs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      data: drugs,
      message: 'Data obat berhasil diambil',
      code_respon: 200,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: 'Terjadi kesalahan saat mengambil data obat',
      code_respon: 500,
    });
  }
});

// Fungsi validasi untuk data pasien
function validatePatient(patient) {
  const schema = Joi.object({
    nama: Joi.string().required(),
    umur: Joi.number().integer().required(),
    alamat: Joi.string().required(),
    berat: Joi.number().required(),
    tensi: Joi.string().required(),
  });

  return schema.validate(patient);
}

// Menjalankan server
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server running on port ${port}`));
