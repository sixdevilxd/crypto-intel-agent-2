# 📱 PANDUAN SETUP DI HP - STEP BY STEP UNTUK PEMULA

Panduan lengkap untuk menjalankan Meme Coin Scanner di HP menggunakan Termux.

---

## 🎯 TUJUAN

Di panduan ini, kamu akan belajar:
- ✅ Install Termux di HP
- ✅ Install Python
- ✅ Download project dari GitHub
- ✅ Jalankan scanner
- ✅ Analisis meme coin pertamamu

**Waktu yang dibutuhkan: ~15 menit**

---

## 📋 PERSYARATAN

- HP Android (iOS tidak support Termux)
- Koneksi internet
- Storage kosong minimal 500MB
- Tidak perlu root

---

## 🚀 LANGKAH 1: INSTALL TERMUX

### Apa itu Termux?

Termux adalah terminal emulator untuk Android yang memungkinkan kamu menjalankan command Linux di HP.

### Cara Install:

1. **Buka Google Play Store**
2. **Ketik "Termux"** di kolom pencarian
3. **Cari aplikasi dari Fredrik Fornwall** (official)
4. **Tap "Install"**
5. **Tunggu sampai selesai**

### Verifikasi:

- Buka Termux
- Seharusnya muncul terminal dengan format: `$ ` atau `# `

✅ Jika muncul, Termux sudah siap!

---

## 🐍 LANGKAH 2: INSTALL PYTHON

Copy-paste command ini satu persatu di Termux:

### 2.1 Update Package Manager

```bash
pkg update
```

**Output:** Ada list package yang di-update

### 2.2 Upgrade (optional tapi disarankan)

```bash
pkg upgrade -y
```

**Output:** Sudah siap lanjut ke step berikutnya

### 2.3 Install Python

```bash
pkg install python -y
```

**Output:** Python sedang di-install...

### 2.4 Verifikasi Python Terinstall

```bash
python --version
```

**Output yang diharapkan:**
```
Python 3.11.x (atau versi terbaru)
```

✅ Jika muncul version, Python sudah berhasil!

---

## 📥 LANGKAH 3: DOWNLOAD PROJECT

### 3.1 Masuk ke Home Directory

```bash
cd ~
```

### 3.2 Clone Repository

```bash
git clone https://github.com/sixdevilxd/crypto-intel-agent-2.git
```

**Apa yang terjadi:**
- Git download project dari GitHub
- Folder `crypto-intel-agent-2` akan dibuat

### 3.3 Masuk ke Folder

```bash
cd crypto-intel-agent-2
```

### 3.4 Lihat File yang Ada

```bash
ls -la
```

**Output:** Kamu akan lihat list file, termasuk `simple_scanner.py` dan `demo.py`

✅ Project sudah berhasil didownload!

---

## ���� LANGKAH 4: INSTALL DEPENDENCIES

### 4.1 Install Minimal (hanya yang diperlukan)

```bash
pip install requests
```

**Apa yang terjadi:**
- `requests` adalah library untuk HTTP requests
- Akan terinstall otomatis

### 4.2 Verifikasi Instalasi

```bash
python -c "import requests; print('OK')"
```

**Output:** `OK`

✅ Dependencies sudah siap!

---

## ▶️ LANGKAH 5: JALANKAN SCANNER

Sekarang kita jalankan scanner untuk pertama kali!

### 5.1 Jalankan Demo (RECOMMENDED UNTUK PEMULA)

```bash
python demo.py
```

**Yang akan terjadi:**
1. Scanner menampilkan 3 contoh token
2. Setiap contoh dianalisis
3. Kamu bisa lihat penjelasan mengapa safe/risky
4. Diakhir, kamu bisa coba scan token sendiri

### 5.2 Jalankan App Menu Utama

```bash
python app.py
```

**Yang akan terjadi:**
1. Menu akan muncul dengan opsi:
   - 1. Scan Token
   - 2. Contoh Analisis
   - 3. Keluar

---

## 🔍 LANGKAH 6: CARA MENGGUNAKAN

### Skenario 1: Jalankan Demo

```bash
$ python demo.py

╔════════════════════════════════════════════╗
║   MEME COIN SCANNER - DEMO MODE           ║
║   Lihat contoh berbagai skenario           ║
╚════════════════════════════════════════════╝

[Contoh 1 akan ditampilkan...]
```

**Apa yang terjadi:**
- Scanner menampilkan contoh token SAFE
- Kemudian token MEDIUM RISK
- Terakhir token CRITICAL/HIGH RISK
- Di akhir ada penjelasan WHY

### Skenario 2: Scan Token Real

```bash
$ python app.py

╔══════════════════════════════════════╗
║  MEME COIN SCANNER - Versi Mobile   ║
║  Cocok untuk HP/Termux               ║
╚══════════════════════════════════════╝

MENU:
1. Scan Token
2. Contoh Analisis
3. Keluar

Pilih (1-3): 1
Masukkan alamat token (paste dari Solscan/Etherscan): 
```

**Cara dapatkan token address:**

1. **Buka Solscan.io** (untuk Solana) atau **Etherscan.io** (untuk Ethereum)
2. **Cari coin yang ingin dianalisis**
3. **Copy contract address** (biasanya tulisan panjang)
4. **Paste ke Termux** (long press, paste)

**Contoh token address Solana:**
```
EPjFWaLb3oDHZB8hZ8M7rrFXZVBnZF8VkzHkPwJ6V7T2
```

---

## 📊 LANGKAH 7: MEMBACA HASIL

### Score Breakdown:

```
🟢 SAFE (80-100)           → Investasi aman, ada komunitas
✅ LOW RISK (60-79)        → Cukup aman untuk entry kecil
⚡ MEDIUM (40-59)          → HATI-HATI! Ada risiko
⚠️ HIGH RISK (20-39)       → JANGAN MASUK! Kemungkinan scam
❌ CRITICAL (<20)          → HINDARI SEPENUHNYA!
```

### Contoh Output Real:

```
==================================================
                HASIL ANALISIS
==================================================

TOKEN INFO:
  Nama: Meme Token (MEME)
  Price: $0.00001234
  Market Cap: $1,234,567
  Umur: 48.5 jam
  Holders: 15,234

SAFETY SCORE:
  ✅ LOW RISK - 68.5/100

✓ POSITIF:
  • Liquidity tinggi: $2,500,000
  • Holder seimbang: Top 10 punya 28.3%
  • Sudah lama launch: 48 jam
  • Twitter followers: 45,000
  • Telegram members: 120,000

✗ RISIKO:
  • Kenaikan price 320% dalam 24 jam

REKOMENDASI:
  Cukup aman untuk entry kecil. Pantau komunitas.
```

---

## 💰 LANGKAH 8: TRADING STRATEGY

### Berdasarkan Score:

#### 🟢 Score 80-100 (SAFE)
```
Entry Size: 1-2% dari portfolio
Stop Loss: -20%
Target: +100%
Durasi: 1-2 minggu
Risk/Reward: 1:5
```

#### ✅ Score 60-79 (LOW RISK)
```
Entry Size: 0.5-1% dari portfolio
Stop Loss: -15%
Target: +50%
Durasi: 1 minggu
Risk/Reward: 1:3
```

#### ⚡ Score 40-59 (MEDIUM)
```
Entry Size: 0.2-0.5% dari portfolio
Stop Loss: -10%
Target: +25%
Durasi: 3-5 hari
Risk/Reward: 1:2
```

#### ⚠️ Score <40 (HIGH RISK)
```
JANGAN MASUK!
Cari token lain yang lebih aman
```

---

## 🔧 LANGKAH 9: TROUBLESHOOTING

### Problem: "Python not found"

**Solusi:**
```bash
pkg install python -y
python --version
```

### Problem: "ModuleNotFoundError: No module named 'requests'"

**Solusi:**
```bash
pip install requests --upgrade
```

### Problem: "git: command not found"

**Solusi:**
```bash
pkg install git -y
```

### Problem: Scanner berhenti/lambat

**Solusi:**
```bash
# Tekan Ctrl + C untuk hentikan

# Jalankan ulang
python demo.py
```

### Problem: File tidak ditemukan

**Solusi:**
```bash
# Pastikan di folder yang benar
cd ~/crypto-intel-agent-2

# Cek file ada
ls -la

# Coba jalankan lagi
python demo.py
```

---

## 📚 LANGKAH 10: BELAJAR LEBIH LANJUT

### File-file yang Penting:

1. **`simple_scanner.py`** - Core analyzer code
2. **`app.py`** - Menu utama CLI
3. **`demo.py`** - Demo dengan contoh
4. **`PANDUAN_SETUP_HP.md`** - Panduan ini

### Hubungan Antar File:

```
app.py (menu CLI)
   ↓
   calls simple_scanner.py

demo.py (demo contoh)
   ↓
   uses simple_scanner.py
```

### Cara Melihat Kode (Opsional):

```bash
# Lihat file
cat simple_scanner.py

# Atau buka dengan text editor
nano simple_scanner.py

# Tekan Ctrl + X untuk keluar
```

---

## ✅ CHECKLIST COMPLETION

Tandai yang sudah selesai:

- [ ] Termux terinstall
- [ ] Python terinstall
- [ ] Project di-download
- [ ] Dependencies terinstall
- [ ] `python demo.py` berhasil jalan
- [ ] `python app.py` berhasil jalan
- [ ] Sudah analisis minimal 1 token
- [ ] Memahami cara membaca hasil

**Jika semua tercentang = SELAMAT! 🎉**

---

## 🎓 QUICK REFERENCE (COPY-PASTE)

Untuk setup cepat ulang, copy-paste ini:

```bash
# Update & install
pkg update && pkg upgrade -y
pkg install python git -y

# Clone & setup
cd ~
git clone https://github.com/sixdevilxd/crypto-intel-agent-2.git
cd crypto-intel-agent-2
pip install requests

# Jalankan
python demo.py
```

---

## 💡 TIPS UNTUK PEMULA

1. **Jalankan `demo.py` dulu sebelum `app.py`**
   - Agar paham cara kerja analyzer

2. **Jangan invest langsung**
   - Analisis dulu berkali-kali
   - Pahami score system
   - Practice dengan akun demo

3. **DYOR (Do Your Own Research)**
   - Gunakan scanner sebagai tools
   - Bukan satu-satunya sumber

4. **Set rules sebelum trading**
   - Stop loss HARUS
   - Target profit HARUS
   - Jangan FOMO

5. **Manage risk**
   - Jangan all-in 1 token
   - Portfolio allocation penting
   - Hanya invest yang mampu hilang

---

## ⚠️ DISCLAIMER PENTING

```
⚠️ INI BUKAN FINANCIAL ADVICE ⚠️

Scanner ini dibuat untuk:
✅ Educational purposes
✅ Research tools
❌ BUKAN investment advice

INVESTASI DI CRYPTO SANGAT BERISIKO!
- Bisa total loss
- Rugpull bisa terjadi kapan saja
- Dev bisa scam
- Hanya invest yang mampu hilang

"Invest with head, not emotion!"
```

---

## 🆘 BUTUH BANTUAN?

Jika masih error:

1. **Baca error message** - biasanya jelas
2. **Google error tersebut** - solution pasti ada
3. **Cek internet connection** - harus stabil
4. **Restart Termux** - kill app & buka lagi
5. **Reinstall** - hapus folder & clone ulang

---

## 🎉 SELAMAT!

Kamu sudah berhasil setup Meme Coin Scanner di HP!

**Sekarang kamu bisa:**
- ✅ Analisis meme coin kapan saja
- ✅ Score risk sebelum invest
- ✅ Avoid scam/rugpull
- ✅ Make informed decisions

**Next Steps:**
1. Analisis token favorit
2. Track hasil analysis
3. Improve trading skill
4. Jangan stop learning!

---

**Happy Trading! 🚀**

*Ingat: Kesuksesan di crypto butuh patience, discipline, dan knowledge!*
