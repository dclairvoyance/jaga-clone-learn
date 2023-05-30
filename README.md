# jaga-clone-learn
Sebagai task pertama untuk Kerja Praktik

## Target
### Task 1
1. Setup dan install quasar (https://quasar.dev/)
2. Buat halaman CRUD sederhana tanpa connect ke API (halaman CRUD minimal terdiri dari komponen: table, text input, dropdown, checkbox, radio button, file upload, modal, confirmation dialog)

![jaga1](readme-images/jaga1.png)
![jaga2](readme-images/jaga2.png)
![jaga3](readme-images/jaga3.png)

### Task 2
Melanjutkan ⁠Task 1, lakukan koneksi data melalui API.
1. Sesuaikan halaman dengan struktur data balikan dari API.
2. Implementasikan API berikut dari URL http://cancer.akhdani.net:9005/jaga-phalcon/public
- Daftar Perusahaan
```
GET {{url}}/v5/perusahaan
available params:
keyword={text}
kode_provinsi={2digit}
kode_kab_kota={4digit}
limit={digit}
offset={digit}
```
- Detail Perusahaan
```
GET {{url}}/v5/perusahaan/{id}
```
- Create Perusahaan
```
POST {{url}}/v5/perusahaan/create
json payload:
{
    "nama": "Perusahaan Palembang",
    "kode_provinsi": "16",
    "kode_kab_kota": "1671",
    "jenis": "SWASTA",
    "alamat": "Jalan Palembang Raya no. 2110"
}

```
- Update Perusahaan
```
POST {{url}}/v5/perusahaan/update/{id}
json payload:
{
    "nama": "Perusahaan Palembang",
    "kode_provinsi": "16",
    "kode_kab_kota": "1671",
    "jenis": "SWASTA",
    "alamat": "Jalan Palembang Raya no. 2110"
}

```
- Delete Perusahaan
```
POST {{url}}/v5/perusahaan/delete/{id}
```
- Restore Perusahaan
```
POST {{url}}/v5/perusahaan/restore/{id}
```
- Login
```
POST {{url}}/v5/auth/login
json payload:
{
    "username": "user50@mail.com",
    "password": "password12345"
}
```
- Daftar Provinsi
```
GET {{url}}/v5/bansos/provinsi_list
available params:
keyword={text}
limit={digit}
offset={digit}
```
- Daftar Kota/Kabupaten
```
GET {{url}}/v5/bansos/pemda_list
available params:
id_provinsi={2digit}
keyword={text}
limit={digit}
offset={digit}
```
- Daftar Jenis Perusahaan
```
GET {{url}}/v5/perusahaan/jenis
```

### Task 3
Penyesuaian data Instansi Pemda tingkat I & II berdasarkan pemekaran wilayah

## Project Details
### Prerequisite
npm/yarn harus sudah terinstalasi (asumsi npm untuk kasus ini)

### How to Setup
```
npm init quasar
```

### How to Run
```
git clone https://github.com/dclairvoyance/jaga-clone-learn.git
cd jaga-clone-learn/quasar-project
npx quasar dev
```
Website akan dijalankan pada ip:port localhost:8080

## Progress Details
### Activity Log
| Hari, Tanggal, XM | Pekerjaan                |
| ----------------- | ------------------------ |
| Sen, 22/05/23, AM | perkenalan, setup Quasar |
| Sen, 22/05/23, PM | belajar konsep Vue |
| Sel, 23/05/23, AM | belajar konsep Quasar, structure + styling clone |
| Sel, 23/05/23, PM | belajar persistent state storage VueX dan Pinia, table |
| Rab, 24/05/23, AM | implementasi Vuex, create, delete |
| Rab, 24/05/23, PM | update, activate/deactivate, form validation, dropdown |
| Kam, 25/05/23, AM | checkbox, radio, email validation |
| Kam, 25/05/23, PM | implementasi Axios, get API, async/await |
| Jum, 26/05/23, AM | post API, login |
| Jum, 26/05/23, PM | get API per page, task03 |
| Sen, 29/05/23, AM | dynamic options: provinces and cities, types, create |
| Sen, 29/05/23, PM | read, update, delete, restore, login validation |

### Identity
Damianus Clairvoyance\
13520035

### Usage
Repository ini akan digunakan untuk laporan mata kuliah IF4091 Kerja Praktik Teknik Informatika Institut Teknologi Bandung 2023