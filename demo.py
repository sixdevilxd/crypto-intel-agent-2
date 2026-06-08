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
        "holders_top_10_percent": 22.5,
        "volume_24h": 850000,
        "price_change_24h": 15.5,
        "age_hours": 360,
        "twitter_followers": 125000,
        "telegram_members": 250000,
        "contract_verified": True,
        "has_burn": True,
        "liquidity_locked": True,
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
        "liquidity": 500000,
        "holder_count": 25000,
        "holders_top_10_percent": 38.5,
        "volume_24h": 250000,
        "price_change_24h": 180.0,
        "age_hours": 72,
        "twitter_followers": 45000,
        "telegram_members": 85000,
        "contract_verified": False,
        "has_burn": True,
        "liquidity_locked": False,
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
        "market_cap": 100000,
        "liquidity": 25000,
        "holder_count": 3000,
        "holders_top_10_percent": 67.8,
        "volume_24h": 50000,
        "price_change_24h": 890.0,
        "age_hours": 2.5,
        "twitter_followers": 0,
        "telegram_members": 0,
        "contract_verified": False,
        "has_burn": False,
        "liquidity_locked": False,
    }

    analysis_high = analyzer.analyze_risk(high_risk_token)
    analyzer.print_analysis(high_risk_token, analysis_high)

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

    print(f"{Colors.BOLD}📚 TIPS DARI DEMO:{Colors.RESET}\n")
    print("1. JANGAN FOMO karena price naik banyak")
    print("   → Token yang naik 500%+ biasanya sudah peak\n")
    print("2. PERHATIKAN HOLDER DISTRIBUTION")
    print("   → Jika top 10 > 50%, mudah terjadi dump\n")
    print("3. UMUR TOKEN SANGAT PENTING")
    print("   → Token umur <24 jam sangat berisiko\n")
    print("4. CECK SOCIAL MEDIA")
    print("   → Tidak ada Twitter/Telegram = RED FLAG\n")
    print("5. LIQUIDITY HARUS CUKUP")
    print("   → Liquidity < $100K sangat berisiko\n")

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
