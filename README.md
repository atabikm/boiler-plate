# LMS Boilerplate

Boilerplate aplikasi full-stack untuk pengembangan berikutnya. Struktur ini
memisahkan frontend React/Vite, backend Express/TypeScript, dan PostgreSQL
dengan Prisma. Docker Compose menjadi cara utama untuk menjalankan lingkungan
development agar versi Node, dependensi, dan database konsisten.

## Stack

- **Client:** React 18, Vite, TypeScript, React Router, Axios
- **Server:** Express, TypeScript, Zod, JWT, bcryptjs
- **Database:** PostgreSQL 16 dan Prisma
- **Runtime development:** Docker Compose, bind mount, dan hot reload
- **Runtime production:** image multi-stage client dengan Nginx serta server
  Node.js

## Struktur

```text
.
├── client/                 # React/Vite frontend
│   ├── src/
│   ├── Dockerfile
│   └── docker-entrypoint.sh
├── server/                 # Express/Prisma backend
│   ├── prisma/
│   ├── src/
│   ├── Dockerfile
│   └── docker-entrypoint.sh
└── docker-compose.yml      # client, server, dan PostgreSQL
```

## Prasyarat

- Linux
- Docker Engine dan Docker Compose plugin
- Git (disarankan untuk menjaga permission executable dan line ending)

Node.js/npm tidak wajib terpasang di host jika semua perintah dijalankan
melalui Docker.

## Konfigurasi environment

Buat `server/.env` dan jangan commit file tersebut:

```env
DATABASE_URL=postgresql://<user>:<password>@postgres:5432/<database>?schema=public
JWT_SECRET=<random-secret-panjang>
PORT=5001
```

Nilai `DATABASE_URL` di atas memakai nama service `postgres`, sehingga
digunakan oleh container server. Saat menjalankan server langsung dari host,
gunakan `localhost` sebagai host database.

## Menjalankan development

```bash
docker compose up --build
```

Service yang tersedia:

| Service | URL/Port host | Keterangan |
|---|---:|---|
| Client | `http://localhost:3001` | Vite development server |
| Server | `http://localhost:5001` | Express API |
| Health check | `http://localhost:5001/api/health` | Status backend |
| PostgreSQL | `localhost:5432` | Database development |

Startup server melakukan urutan berikut:

1. `npm install`
2. `prisma generate`
3. `prisma migrate deploy`
4. `prisma db seed`
5. `npm run dev`

Perintah yang umum digunakan:

```bash
docker compose logs -f server
docker compose logs -f client
docker compose down
docker compose down -v       # hapus volume database; data akan hilang
docker compose exec server npx prisma studio
```

## Database dan migration

Setelah mengubah `server/prisma/schema.prisma`, buat migration dari container:

```bash
docker compose exec server npx prisma migrate dev --name describe-change
```

Migration yang sudah dibuat harus disimpan di
`server/prisma/migrations/`. Seed harus idempotent: menjalankannya beberapa
kali tidak boleh membuat data duplikat atau merusak data yang sudah ada.

## Endpoint awal

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/health`

Frontend mengambil base URL dari `VITE_API_BASE_URL`. Nilai ini harus menunjuk
ke API yang dapat diakses browser, bukan ke nama service Docker internal.

## Aturan Linux: LF dan executable

### LF versus CRLF

Linux mengharapkan line ending LF (`\n`). Script dengan CRLF (`\r\n`) dapat
gagal dengan error seperti `bad interpreter: /bin/sh^M`, walaupun shebang-nya
terlihat benar.

Periksa file:

```bash
file client/docker-entrypoint.sh server/docker-entrypoint.sh
```

Jika ditemukan CRLF, ubah ke LF tanpa membutuhkan `dos2unix`:

```bash
sed -i 's/\r$//' client/docker-entrypoint.sh server/docker-entrypoint.sh
```

Untuk proyek boilerplate, editor sebaiknya dikonfigurasi menggunakan LF.
Dengan Git, konfigurasi yang aman untuk Linux biasanya:

```bash
git config --global core.autocrlf input
git config --global core.eol lf
```

### Mengapa `chmod +x` diperlukan?

Shebang (`#!/bin/sh`) hanya menentukan interpreter; shebang tidak memberikan
permission eksekusi. File baru biasanya dibuat dengan mode non-executable
(`644`), sedangkan script entrypoint perlu mode executable (`755` atau
`775`).

```bash
chmod +x client/docker-entrypoint.sh server/docker-entrypoint.sh
stat -c '%A %a %n' client/docker-entrypoint.sh server/docker-entrypoint.sh
```

Output yang benar memiliki `x`, misalnya `-rwxr-xr-x`. Git menyimpan bit
executable sebagai metadata, jadi permission perlu diperiksa setelah checkout
atau ketika file dibuat ulang. Docker juga dapat diberi fallback eksplisit:

```dockerfile
RUN chmod +x docker-entrypoint.sh
```

Namun, menjaga permission file di source control tetap merupakan solusi utama.

## Checklist sebelum menambah modul

1. Tentukan route dan controller/service di server.
2. Tambahkan DTO Zod untuk input eksternal.
3. Jika ada perubahan data, ubah schema Prisma dan buat migration.
4. Pastikan seed tetap idempotent.
5. Tambahkan route ke `server/src/app.ts`.
6. Tambahkan API client dan halaman/komponen di client.
7. Jalankan `docker compose build` dan uji health check.
8. Pastikan script baru memakai LF dan permission yang sesuai.

## Feedback kondisi saat ini

### Perubahan yang sudah diselaraskan

1. Compose, Vite, dan Dockerfile sekarang memakai port client `3001` dan
   server `5001`.
2. Compose sekarang mengirim `VITE_API_BASE_URL=http://localhost:5001/api/v1`,
   sesuai dengan pembacaan environment oleh Vite.
3. Root component client dan interceptor Axios sudah valid untuk build serta
   mengirim header `Authorization: Bearer <token>`.
4. Schema Prisma sekarang memiliki enum `Role` dan model
   `BlacklistedToken`, termasuk migration-nya.
5. Seed hanya mengimpor model yang tersedia dan kegagalan seed menghentikan
   startup, sehingga container tidak terlihat sehat ketika database belum siap.

### Risiko dan perbaikan berikutnya

- Password PostgreSQL di Compose, akun seed, dan fallback `JWT_SECRET` masih
  cocok untuk development saja; jangan gunakan nilai tersebut di production.
- Tambahkan `server/.env.example` tanpa secret nyata agar setup pengguna baru
  lebih jelas.
- Tambahkan healthcheck untuk server dan gunakan `depends_on` berbasis health
  jika client memang harus menunggu API.
- Tambahkan lint, test, dan pemeriksaan type/build sebagai langkah CI.
- Hindari `catch (error: any)` jika error handling sudah mulai distabilkan;
  gunakan tipe `unknown` dan helper error yang terpusat.
- Commit `package-lock.json` dipertahankan agar instalasi reproducible, tetapi
  entrypoint development tetap menjalankan `npm install` setiap container
  start. Jika startup terlalu lambat, pertimbangkan hanya menjalankannya saat
  lockfile berubah.

## Status validasi dokumentasi ini

- `docker compose config --quiet` berhasil.
- `docker compose build client server` berhasil.
- Production build client berhasil, termasuk `tsc` dan `vite build`.
- Production build server berhasil dengan `tsc`.
- `prisma validate` berhasil.
- Smoke test Compose berhasil: migration diterapkan, seed selesai, endpoint
  health mengembalikan HTTP 200, dan client mengembalikan HTTP 200.
- Build langsung dengan `npm` di host belum dijalankan karena `npm` tidak
  terpasang di host; workflow yang tersedia adalah build melalui Docker.
