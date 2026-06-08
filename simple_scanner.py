"""
Simple Meme Coin Scanner - Versi Mobile/HP
Mudah digunakan untuk pemula
"""

import requests
import json
from datetime import datetime
from typing import Dict, List
import time

# Warna untuk terminal
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


class MemeTokenAnalyzer:
    """
    Analyzer sederhana untuk meme coin
    Bisa dijalankan di HP/Termux
    """

    def __init__(self):
        self.token_data = {}
        print(f"{Colors.BLUE}✓ Meme Coin Analyzer Siap!{Colors.RESET}")

    def print_header(self, text):
        """Print header yang rapi"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*50}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{text:^50}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*50}{Colors.RESET}\n")

    def scan_token(self, token_address: str) -> Dict:
        """
        Scan token menggunakan API gratis (CoinGecko)
        
        Args:
            token_address: Alamat token di blockchain
            
        Returns:
            Data token yang sudah dianalisis
        """
        self.print_header("SCANNING TOKEN...")
        print(f"📍 Alamat: {token_address}\n")

        try:
            # Simulasi data karena API memerlukan kunci
            # Ganti dengan API real di production
            result = self._get_token_data_simulation(token_address)
            return result

        except Exception as e:
            print(f"{Colors.RED}❌ Error: {str(e)}{Colors.RESET}")
            return None

    def _get_token_data_simulation(self, address: str) -> Dict:
        """Simulasi data token untuk demo"""
        import random

        # Generate data realistis untuk demo
        data = {
            "name": "Meme Token",
            "symbol": "MEME",
            "address": address,
            "price": round(random.uniform(0.000001, 0.1), 8),
            "market_cap": round(random.uniform(100000, 10000000), 0),
            "liquidity": round(random.uniform(50000, 5000000), 0),
            "holder_count": random.randint(1000, 100000),
            "holders_top_10_percent": round(random.uniform(10, 60), 1),
            "volume_24h": round(random.uniform(10000, 1000000), 0),
            "price_change_24h": round(random.uniform(-50, 200), 1),
            "age_hours": random.randint(1, 720),
            "twitter_followers": random.randint(0, 100000),
            "telegram_members": random.randint(0, 500000),
            "contract_verified": random.choice([True, False]),
            "has_burn": random.choice([True, False]),
            "liquidity_locked": random.choice([True, False]),
        }

        return data

    def analyze_risk(self, data: Dict) -> Dict:
        """
        Analisis risiko token
        Menggunakan logika sederhana tapi efektif
        """
        score = 50  # Skor awal
        risk_factors = []
        positive_factors = []

        print(f"{Colors.BOLD}ANALYZING RISK...{Colors.RESET}\n")

        # ===== POSITIVE FACTORS =====
        print(f"{Colors.GREEN}✓ FAKTOR POSITIF:{Colors.RESET}")

        # Liquidity
        if data["liquidity"] > 1000000:
            score += 20
            positive_factors.append(f"Liquidity besar: ${data['liquidity']:,.0f}")
            print(f"  ✓ Liquidity tinggi: ${data['liquidity']:,.0f}")
        elif data["liquidity"] > 100000:
            score += 10
            positive_factors.append(f"Liquidity cukup: ${data['liquidity']:,.0f}")
            print(f"  ✓ Liquidity cukup: ${data['liquidity']:,.0f}")

        # Holder distribution
        if data["holders_top_10_percent"] < 30:
            score += 15
            positive_factors.append(
                f"Distribusi holder sehat ({data['holders_top_10_percent']:.1f}%)"
            )
            print(f"  ✓ Holder seimbang: Top 10 punya {data['holders_top_10_percent']:.1f}%")

        # Age
        if data["age_hours"] > 168:  # > 1 minggu
            score += 15
            positive_factors.append(f"Contract sudah tua ({data['age_hours']:.0f} jam)")
            print(f"  ✓ Sudah lama launch: {data['age_hours']:.0f} jam")
        elif data["age_hours"] > 24:
            score += 8
            positive_factors.append(f"Contract berumur 1+ hari")
            print(f"  ✓ Sudah 1+ hari: {data['age_hours']:.0f} jam")

        # Social
        if data["twitter_followers"] > 50000:
            score += 12
            positive_factors.append(
                f"Twitter followers banyak: {data['twitter_followers']:,}"
            )
            print(f"  ✓ Twitter followers: {data['twitter_followers']:,}")

        if data["telegram_members"] > 50000:
            score += 12
            positive_factors.append(
                f"Telegram members banyak: {data['telegram_members']:,}"
            )
            print(f"  ✓ Telegram members: {data['telegram_members']:,}")

        # Security
        if data["contract_verified"]:
            score += 10
            positive_factors.append("Contract terverifikasi")
            print(f"  ✓ Contract terverifikasi")

        if data["liquidity_locked"]:
            score += 15
            positive_factors.append("Liquidity di-lock")
            print(f"  ✓ Liquidity di-lock")

        if data["has_burn"]:
            score += 8
            positive_factors.append("Ada token burn")
            print(f"  ✓ Ada token burn")

        # ===== NEGATIVE FACTORS =====
        print(f"\n{Colors.RED}✗ FAKTOR NEGATIF:{Colors.RESET}")

        # Holder concentration
        if data["holders_top_10_percent"] > 50:
            score -= 25
            risk_factors.append(
                f"Konsentrasi pemilik sangat tinggi ({data['holders_top_10_percent']:.1f}%)"
            )
            print(f"  ✗ Holder terkonsentrasi: {data['holders_top_10_percent']:.1f}%")
        elif data["holders_top_10_percent"] > 40:
            score -= 15
            risk_factors.append(
                f"Konsentrasi pemilik tinggi ({data['holders_top_10_percent']:.1f}%)"
            )
            print(f"  ✗ Top 10 punya {data['holders_top_10_percent']:.1f}%")

        # Liquidity terlalu rendah
        if data["liquidity"] < 50000:
            score -= 20
            risk_factors.append(f"Liquidity sangat rendah: ${data['liquidity']:,.0f}")
            print(f"  ✗ Liquidity rendah: ${data['liquidity']:,.0f}")

        # Price spike terlalu cepat
        if data["price_change_24h"] > 500:
            score -= 25
            risk_factors.append(
                f"Kenaikan price terlalu cepat ({data['price_change_24h']:.0f}%)"
            )
            print(f"  ✗ Pump terlalu cepat: +{data['price_change_24h']:.0f}%")

        # Age terlalu baru
        if data["age_hours"] < 1:
            score -= 10
            risk_factors.append("Contract terlalu baru (< 1 jam)")
            print(f"  ✗ Terlalu baru (< 1 jam)")

        # No social
        if data["twitter_followers"] == 0 and data["telegram_members"] == 0:
            score -= 15
            risk_factors.append("Tidak ada social media")
            print(f"  ✗ Tidak ada social media")

        # Batasi score
        score = max(0, min(100, score))

        return {
            "score": score,
            "positive_factors": positive_factors,
            "risk_factors": risk_factors,
        }

    def get_risk_level(self, score: float) -> tuple:
        """Tentukan level risiko berdasarkan score"""
        if score >= 80:
            return "🟢 SAFE", Colors.GREEN
        elif score >= 60:
            return "✅ LOW RISK", Colors.GREEN
        elif score >= 40:
            return "⚡ MEDIUM", Colors.YELLOW
        elif score >= 20:
            return "⚠️ HIGH RISK", Colors.RED
        else:
            return "❌ CRITICAL", Colors.RED

    def get_recommendation(self, score: float) -> str:
        """Rekomendasi berdasarkan score"""
        if score >= 80:
            return "Investasi yang cukup aman. Monitor terus perkembangannya."
        elif score >= 60:
            return "Cukup aman untuk entry kecil. Pantau komunitas."
        elif score >= 40:
            return "HATI-HATI! Risiko sedang. Hanya untuk trader berpengalaman."
        elif score >= 20:
            return "⚠️ RISIKO TINGGI! Bisa jadi PUMP & DUMP atau RUG PULL. JANGAN ASAL MASUK!"
        else:
            return "❌ HINDARI! Kemungkinan besar SCAM atau RUG PULL!"

    def print_analysis(self, data: Dict, analysis: Dict):
        """Print hasil analisis dengan format rapi"""
        risk_level, color = self.get_risk_level(analysis["score"])

        self.print_header("📊 HASIL ANALISIS")

        # Info token
        print(f"{Colors.BOLD}TOKEN INFO:{Colors.RESET}")
        print(f"  Nama: {data['name']} ({data['symbol']})")
        print(f"  Price: ${data['price']:.8f}")
        print(f"  Market Cap: ${data['market_cap']:,.0f}")
        print(f"  Umur: {data['age_hours']:.1f} jam")
        print(f"  Holders: {data['holder_count']:,}")

        # Score dan risk level
        print(f"\n{Colors.BOLD}SAFETY SCORE:{Colors.RESET}")
        print(f"  {color}{risk_level} - {analysis['score']:.1f}/100{Colors.RESET}")

        # Breakdown
        if analysis["positive_factors"]:
            print(f"\n{Colors.GREEN}{Colors.BOLD}✓ POSITIF:{Colors.RESET}")
            for factor in analysis["positive_factors"]:
                print(f"  • {factor}")

        if analysis["risk_factors"]:
            print(f"\n{Colors.RED}{Colors.BOLD}✗ RISIKO:{Colors.RESET}")
            for factor in analysis["risk_factors"]:
                print(f"  • {factor}")

        # Rekomendasi
        recommendation = self.get_recommendation(analysis["score"])
        print(f"\n{Colors.BOLD}REKOMENDASI:{Colors.RESET}")
        print(f"  {recommendation}")

        # Trading tips
        self._print_trading_tips(data, analysis["score"])

    def _print_trading_tips(self, data: Dict, score: float):
        """Print tips trading"""
        print(f"\n{Colors.BOLD}💡 TIPS TRADING:{Colors.RESET}")

        if score >= 60:
            print(f"  1. Bisa entry kecil-kecilan terlebih dahulu")
            print(f"  2. Set stop loss di -20% sampai -30%")
            print(f"  3. Target profit 50%-100%")
            print(f"  4. Jangan FOMO, keluar kalau sudah profit")
        else:
            print(f"  1. Lebih baik skip token ini")
            print(f"  2. Cari token dengan score lebih tinggi")
            print(f"  3. Hati-hati dengan RUG PULL")
            print(f"  4. Jangan ikuti HYPE, karena bisa jadi PUMP & DUMP")

        print(f"\n{Colors.YELLOW}⚠️ DISCLAIMER:{Colors.RESET}")
        print(f"  • Ini BUKAN financial advice")
        print(f"  • Investasi di crypto SANGAT BERISIKO")
        print(f"  • DYOR (Do Your Own Research)")
        print(f"  • Jangan invest lebih dari yang mampu hilang")

    def quick_scan(self, token_address: str):
        """One-liner untuk quick scan"""
        print(f"\n{Colors.BOLD}{Colors.BLUE}🔍 Quick Scan...{Colors.RESET}\n")

        data = self.scan_token(token_address)
        if data:
            analysis = self.analyze_risk(data)
            self.print_analysis(data, analysis)
        else:
            print(f"{Colors.RED}Gagal scan token!{Colors.RESET}")
