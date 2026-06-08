"""
CLI Interface untuk Simple Scanner
"""

from simple_scanner import MemeTokenAnalyzer, Colors


# ===== SIMPLE CLI INTERFACE =====
def main():
    """Interface command line yang sederhana"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}")
    print("╔══════════════════════════════════════╗")
    print("║  MEME COIN SCANNER - Versi Mobile   ║")
    print("║  Cocok untuk HP/Termux               ║")
    print("╚══════════════════════════════════════╝")
    print(f"{Colors.RESET}\n")

    analyzer = MemeTokenAnalyzer()

    while True:
        print(f"\n{Colors.BOLD}MENU:{Colors.RESET}")
        print("1. Scan Token")
        print("2. Contoh Analisis")
        print("3. Keluar")

        choice = input(f"\n{Colors.BLUE}Pilih (1-3): {Colors.RESET}").strip()

        if choice == "1":
            token = input(
                f"{Colors.BLUE}Masukkan alamat token (paste dari Solscan/Etherscan): {Colors.RESET}"
            ).strip()
            if token:
                analyzer.quick_scan(token)
            else:
                print(f"{Colors.RED}Alamat token tidak boleh kosong!{Colors.RESET}")

        elif choice == "2":
            print(f"\n{Colors.YELLOW}Menjalankan contoh analisis...{Colors.RESET}")
            # Contoh token address
            example_address = "EPjFWaLb3oDHZB8hZ8M7rrFXZVBnZF8VkzHkPwJ6V7T2"
            analyzer.quick_scan(example_address)

        elif choice == "3":
            print(f"{Colors.GREEN}Terima kasih! 👋{Colors.RESET}\n")
            break

        else:
            print(f"{Colors.RED}Pilihan tidak valid!{Colors.RESET}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print(f"\n{Colors.RED}Program dihentikan!{Colors.RESET}\n")
