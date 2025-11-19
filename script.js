let chart = null;

window.onload = () => {
    // Reset input & output otomatis
    document.getElementById("saldoAwal").value = "";
    document.getElementById("penghasilan").value = "";
    document.getElementById("pengeluaran").value = "";
    document.getElementById("target").value = "";
    document.getElementById("durasi").value = "";

    document.getElementById("hasil").innerHTML = "";
    document.getElementById("habis").innerHTML = "";
    document.getElementById("targetInfo").innerHTML = "";

    // Dark mode tetap tersimpan
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
        document.getElementById("darkBtn").innerText = "☀";
    }
};

function toggleDarkMode() {
    document.body.classList.toggle("dark");
    const mode = document.body.classList.contains("dark");
    localStorage.setItem("darkMode", mode);
    document.getElementById("darkBtn").innerText = mode ? "☀" : "🌙";
}

function hitung() {
    const saldoAwal = Number(document.getElementById("saldoAwal").value);
    const penghasilan = Number(document.getElementById("penghasilan").value);
    const pengeluaran = Number(document.getElementById("pengeluaran").value);
    const target = Number(document.getElementById("target").value);
    const durasi = Number(document.getElementById("durasi").value) || 10;

    if (!saldoAwal || !penghasilan || !pengeluaran) {
        alert("Harap isi saldo awal, penghasilan, dan pengeluaran!");
        return;
    }

    const totalBulan = durasi * 12;

    let saldo = saldoAwal;
    let labels = [];
    let dataSaldo = [];
    let saldoHabis = null;
    let targetTercapai = null;

    document.getElementById("hasil").innerHTML = "";
    document.getElementById("habis").innerHTML = "";
    document.getElementById("targetInfo").innerHTML = "";

    const namaBulan = [
        "Januari","Februari","Maret","April","Mei","Juni",
        "Juli","Agustus","September","Oktober","November","Desember"
    ];

    let tanggal = new Date();
    let bulan = tanggal.getMonth();
    let tahun = tanggal.getFullYear();

    for (let i = 1; i <= totalBulan; i++) {
        let label = `${namaBulan[bulan]} ${tahun}`;
        let saldoSebelum = saldo;

        saldo += penghasilan - pengeluaran;

        labels.push(label);
        dataSaldo.push(saldo);

        let warna = saldo > saldoSebelum ? "green" : "red";

        document.getElementById("hasil").innerHTML +=
            `<span class="${warna}">${label}: Rp ${saldo.toLocaleString()}</span><br>`;

        if (saldo <= 0 && saldoHabis === null) {
            saldoHabis = label;
        }

        if (target > 0 && saldo >= target && targetTercapai === null) {
            targetTercapai = label;
        }

        bulan++;
        if (bulan > 11) {
            bulan = 0;
            tahun++;
        }
    }

    if (saldoHabis) {
        document.getElementById("habis").innerHTML =
            `<span class="red">⚠ Saldo habis pada: ${saldoHabis}</span>`;
    } else {
        document.getElementById("habis").innerHTML =
            `<span class="green">Saldo aman untuk ${durasi} tahun.</span>`;
    }

    if (targetTercapai) {
        document.getElementById("targetInfo").innerHTML =
            `<span class="green">🎯 Target saldo tercapai pada: ${targetTercapai}</span>`;
    }

    const ctx = document.getElementById("grafikSaldo").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: "Perkembangan Saldo",
                data: dataSaldo,
                borderColor: "#2f80ed",
                backgroundColor: "rgba(47,128,237,0.2)",
                borderWidth: 2,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 45
                    }
                }
            }
        }
    });
}

function resetAll() {
    // Kosongkan input
    document.getElementById("saldoAwal").value = "";
    document.getElementById("penghasilan").value = "";
    document.getElementById("pengeluaran").value = "";
    document.getElementById("target").value = "";
    document.getElementById("durasi").value = "";

    // Kosongkan output
    document.getElementById("hasil").innerHTML = "";
    document.getElementById("habis").innerHTML = "";
    document.getElementById("targetInfo").innerHTML = "";

    // Hapus grafik jika ada
    if (chart) {
        chart.destroy();
        chart = null;
    }
}
