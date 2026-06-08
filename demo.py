"""
Demo Scanner - Contoh Pemakaian Langsung
Jalankan ini untuk melihat hasil analisis
"""

from simple_scanner import MemeTokenAnalyzer, Colors


def demo_mode():
    """Demo mode dengan berbagai skenario token"""

    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("╔════════════════════════════════════════════╗")
    print("║   MEME COIN SCANNER - DEMO MODE           ║")
    print("║   Lihat contoh berbagai skenario           ║")
    print("╚════════════════════════════════════════════╝")
    print(f"{Colors.RESET}\n")

    analyzer = MemeTokenAnalyzer()

    # Contoh 1: Token SAFE
    print(f"\n{Colors.BOLD}{Colors.GREEN}{'='*50}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.GREEN}CONTOH 1: TOKEN AMAN (Score: 80+){Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.GREEN}{'='*50}{Colors.RESET}\n")

    safe_token = {
        "name": "SafeMoon Pro",
        "symbol": "SAFEMOON",
        "address": "0xsafemoonaddress...",
        "price": 0.000234,
        "market_cap": 5000000,
        "liquidity": 2500000,
        "holder_count": 85000,
        "holders_top_10_percent": 22.5,  # GOOD: Low concentration
        "volume_24h": 850000,
        "price_change_24h": 15.5,  # GOOD: Moderate increase
        "age_hours": 360,  # GOOD: 15 hari
        "twitter_followers": 125000,  # GOOD: Banyak followers
        "telegram_members": 250000,  # GOOD: Banyak members
        "contract_verified": True,  # GOOD
        "has_burn": True,  # GOOD
        "liquidity_locked": True,  # GOOD
    }

    analysis_safe = analyzer.analyze_risk(safe_token)
    analyzer.print_analysis(safe_token, analysis_safe)

    # Contoh 2: Token MEDIUM RISK
    print(f"\n{Colors.BOLD}{Colors.YELLOW}{'='*50}{Colors.RESET}")
    print(
        f"{Colors.BOLD}{Colors.YELLOW}CONTOH 2: TOKEN MEDIUM RISK (Score: 40-59){Colors.RESET}"
    )
    print(f"{Colors.BOLD}{Colors.YELLOW}{'='*50}{Colors.RESET}\n")

    medium_token = {
        "name": "Doge Moon",
        "symbol": "DOGEM",
        "address": "0xdogemoonaddress...",
        "price": 0.00001234,
        "market_cap": 1200000,
        "liquidity": 500000,  # OK
        "holder_count": 25000,  # Lumayan
        "holders_top_10_percent": 38.5,  # WARNING: Agak terkonsentrasi
        "volume_24h": 250000,
        "price_change_24h": 180.0,  # WARNING: Naik banyak
        "age_hours": 72,  # Masih baru
        "twitter_followers": 45000,  # OK
        "telegram_members": 85000,  # OK
        "contract_verified": False,  # RISK
        "has_burn": True,
        "liquidity_locked": False,  # RISK
    }

    analysis_medium = analyzer.analyze_risk(medium_token)
    analyzer.print_analysis(medium_token, analysis_medium)

    # Contoh 3: Token HIGH RISK
    print(f"\n{Colors.BOLD}{Colors.RED}{'='*50}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.RED}CONTOH 3: TOKEN HIGH RISK (Score: <40){Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.RED}{'='*50}{Colors.RESET}\n")

    high_risk_token = {
        "name": "Pump Coin",
        "symbol": "PUMP",
        "address": "0xpumpaddress...",
        "price": 0.000001,
        "market_cap": 100000,  # Kecil
        "liquidity": 25000,  # DANGER: Terlalu kecil
        "holder_count": 3000,  # Sedikit
        "holders_top_10_percent": 67.8,  # DANGER: Terkonsentrasi tinggi!
        "volume_24h": 50000,
        "price_change_24h": 890.0,  # DANGER: PUMP CEPAT!
        "age_hours": 2.5,  # DANGER: Terlalu baru
        "twitter_followers": 0,  # DANGER: Tidak ada Twitter
        "telegram_members": 0,  # DANGER: Tidak ada Telegram
        "contract_verified": False,  # DANGER
        "has_burn": False,
        "liquidity_locked": False,  # DANGER
    }

    analysis_high = analyzer.analyze_risk(high_risk_token)
    analyzer.print_analysis(high_risk_token, analysis_high)

    # Ringkasan
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*50}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}RINGKASAN DEMO{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*50}{Colors.RESET}\n")

    print(f"{Colors.GREEN}Contoh 1 - SafeMoon Pro:{Colors.RESET}")
    print(f"  Score: {analysis_safe['score']:.1f}/100")
    print(f"  Status: ✅ SAFE")
    print(f"  Aksi: Boleh entry\n")

    print(f"{Colors.YELLOW}Contoh 2 - Doge Moon:{Colors.RESET}")
    print(f"  Score: {analysis_medium['score']:.1f}/100")
    print(f"  Status: ⚡ MEDIUM RISK")
    print(f"  Aksi: Hati-hati, entry kecil saja\n")

    print(f"{Colors.RED}Contoh 3 - Pump Coin:{Colors.RESET}")
    print(f"  Score: {analysis_high['score']:.1f}/100")
    print(f"  Status: ❌ HIGH RISK / CRITICAL")
    print(f"  Aksi: JANGAN MASUK!\n")

    # Penjelasan detail
    print(f"{Colors.BOLD}📚 PENJELASAN DETAIL:{Colors.RESET}\n")

    print(f"{Colors.GREEN}✓ Mengapa Contoh 1 SAFE?{Colors.RESET}")
    print("  1. Liquidity besar ($2.5M) → mudah jual")
    print("  2. Holder seimbang (22%) → tidak ada whale siap dump")
    print("  3. Umur 15 hari → sudah proven tidak rugpull")
    print("  4. Twitter/Telegram banyak → komunitas aktif")
    print("  5. Liquidity locked → dev tidak bisa lari")
    print("  6. Contract verified → transparan\n")

    print(f"{Colors.YELLOW}⚡ Mengapa Contoh 2 MEDIUM RISK?{Colors.RESET}")
    print("  1. Naik 180% dalam 24jam → bisa pump & dump")
    print("  2. Holder 38% pada top 10 → agak rawan dump")
    print("  3. Umur baru 3 hari → belum proven")
    print("  4. Liquidity tidak locked → dev bisa lari kapan saja")
    print("  Aksi: Hanya masuk kecil jika ingin coba\n")

    print(f"{Colors.RED}❌ Mengapa Contoh 3 CRITICAL?{Colors.RESET}")
    print("  1. PUMP 890% dalam 24jam → JELAS PUMP & DUMP!")
    print("  2. Top 10 punya 68% → WHALE SIAP DUMP!")
    print("  3. Umur 2.5 jam → BISA RUGPULL KAPAN SAJA!")
    print("  4. Liquidity hanya $25K → akan habis kalau dump")
    print("  5. Tidak ada Twitter/Telegram → RED FLAG!")
    print("  6. Contract tidak verified → TIDAK TRANSPARAN!")
    print("  Aksi: HINDARI SEPENUHNYA!\n")

    # Tips
    print(f"{Colors.BOLD}💡 TIPS BERDASARKAN DEMO:{Colors.RESET}\n")

    print("1. JANGAN FOMO karena price naik banyak")
    print("   → Token yang naik 500%+ biasanya sudah peak")
    print()
    print("2. PERHATIKAN HOLDER DISTRIBUTION")
    print("   → Jika top 10 > 50%, mudah terjadi dump")
    print()
    print("3. UMUR TOKEN SANGAT PENTING")
    print("   → Token umur <24 jam sangat berisiko")
    print()
    print("4. CECK SOCIAL MEDIA")
    print("   → Tidak ada Twitter/Telegram = RED FLAG")
    print()
    print("5. LIQUIDITY HARUS CUKUP")
    print("   → Liquidity < $100K sangat berisiko")
    print()

    # Demo interaktif
    print(f"\n{Colors.BOLD}🎮 SEKARANG GILIRAN ANDA!{Colors.RESET}\n")

    lanjut = (
        input(f"{Colors.BLUE}Ingin scan token sendiri? (y/n): {Colors.RESET}").lower()
    )
    if lanjut == "y":
        token = input(
            f"{Colors.BLUE}Paste alamat token (atau tekan Enter untuk keluar): {Colors.RESET}"
        ).strip()
        if token:
            analyzer.quick_scan(token)
        else:
            print(f"{Colors.YELLOW}Ok, terimakasih!{Colors.RESET}")
    else:
        print(f"{Colors.GREEN}Terimakasih sudah mencoba demo! 👋{Colors.RESET}\n")


if __name__ == "__main__":
    try:
        demo_mode()
    except KeyboardInterrupt:
        print(f"\n{Colors.RED}Program dihentikan!{Colors.RESET}\n")
