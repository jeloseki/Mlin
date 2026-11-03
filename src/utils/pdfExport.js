// src/utils/pdfExport.js
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const RANK_STEPS = [
  { min: 0, hr: 'Bronca III' },
  { min: 50, hr: 'Bronca II' },
  { min: 120, hr: 'Bronca I' },
  { min: 200, hr: 'Srebro III' },
  { min: 300, hr: 'Srebro II' },
  { min: 420, hr: 'Srebro I' },
  { min: 560, hr: 'Zlato III' },
  { min: 720, hr: 'Zlato II' },
  { min: 900, hr: 'Zlato I' },
  { min: 1100, hr: 'Platina III' },
  { min: 1350, hr: 'Platina II' },
  { min: 1600, hr: 'Platina I' },
  { min: 1900, hr: 'Dijamant III' },
  { min: 2250, hr: 'Dijamant II' },
  { min: 2650, hr: 'Dijamant I' },
  { min: 3100, hr: 'Majstor' },
  { min: 3800, hr: 'Velemajstor' }
];

const getRankName = (points) => {
  let rank = RANK_STEPS[0];
  for (let r of RANK_STEPS) {
    if (points >= r.min) rank = r;
    else break;
  }
  return rank.hr;
};

const fetchFontAsBase64 = async (url) => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font nije pronađen: ${url}`);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
};

export const exportProfileToPDF = async (profile, achievementsCatalog = []) => {
  try {
    if (!profile) {
      alert('Nema podataka o profilu.');
      return;
    }

    const [regBase64, boldBase64] = await Promise.all([
      fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
      fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
    ]);

    const doc = new jsPDF();

    doc.addFileToVFS('Roboto-Regular.ttf', regBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

    // === USKLAĐENO S PALETOM BOJA APLIKACIJE ===
    const brandDark = [15, 23, 42];       // #0f172a (Glavna pozadina / tamne kartice)
    const brandAccent = [217, 119, 6];    // #d97706 ili zlatna #fbbf24 za isticanja
    const textMain = [30, 41, 59];        // Tekst glavni
    const textMuted = [100, 116, 139];    // #64748b (Sivi sporedni tekst)
    const successGreen = [22, 163, 74];   // #16a34a (Pobjede)
    const errorRed = [220, 38, 38];       // #dc2626 (Porazi)

    // --- ZAGLAVLJE DOKUMENTA (Elegantno sa stiliziranom trakom) ---
    doc.setFillColor(...brandDark);
    doc.rect(0, 0, 210, 32, 'F'); // Tamno plava zaglavlje traka preko cijelog vrha

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text('MLIN - SLUŽBENi IZVJEŠTAJ PROFILA', 15, 18);

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225); // Svijetlo siva
    doc.text(`Generirano: ${new Date().toLocaleDateString('hr-HR')} | Nine Men's Morris`, 15, 25);

    // --- KARTICA S PODACIMA O IGRAČU ---
    let currentY = 42;
    doc.setFillColor(248, 250, 252); // Vrlo svijetla pozadina kartice
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, currentY, 180, 22, 3, 3, 'FD');

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...textMain);
    doc.text(`Igrač: ${profile.name || 'Igrač'}`, 20, currentY + 8);

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...textMuted);
    doc.text(`Rang: ${getRankName(Number(profile.points) || 0)}   |   Status: "${profile.bio || 'Spreman za igru!'}"`, 20, currentY + 15);

    currentY += 32;

    // --- 1. TABLICA: STATISTIKA ---
    const wins = Number(profile.wins) || 0;
    const losses = Number(profile.losses) || 0;
    const totalMatchCount = wins + losses;
    const calcWinRate = totalMatchCount > 0 ? Math.round((wins / totalMatchCount) * 100) : 0;
    const points = Number(profile.points) || 0;

    autoTable(doc, {
      startY: currentY,
      margin: { left: 15, right: 15 },
      theme: 'grid',
      styles: { font: 'Roboto', fontSize: 10, textColor: textMain, cellPadding: 4, halign: 'center' },
      headStyles: { fillColor: brandDark, textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9.5 },
      head: [['Ukupno Bodova', 'Odigrani Mečevi', 'Pobjede', 'Porazi', 'Win Rate']],
      body: [[
        { content: `${points} B`, styles: { fontStyle: 'bold', textColor: [37, 99, 235] } },
        totalMatchCount.toString(),
        { content: wins.toString(), styles: { textColor: successGreen, fontStyle: 'bold' } },
        { content: losses.toString(), styles: { textColor: errorRed, fontStyle: 'bold' } },
        `${calcWinRate}%`
      ]]
    });

    currentY = doc.lastAutoTable.finalY + 12;

    // --- 2. TABLICA: POSTIGNUĆA ---
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...textMain);
    doc.text('Osvojena Postignuća', 15, currentY);
    currentY += 4;

    const userAchIds = Array.isArray(profile.achievements) ? profile.achievements : [];
    const catalog = Array.isArray(achievementsCatalog) ? achievementsCatalog : [];
    const unlockedAchievements = catalog.filter(a => userAchIds.includes(String(a.id).trim()));

    const achievementsData = unlockedAchievements.length > 0
      ? unlockedAchievements.map((a, idx) => [
          (idx + 1).toString(),
          a.title || a.name || 'Postignuće',
          a.desc || a.description || '-',
          `+${a.points || 10} B`
        ])
      : [['-', 'Igrač još nema otključanih postignuća.', '-', '-']];

    autoTable(doc, {
      startY: currentY,
      margin: { left: 15, right: 15 },
      head: [['#', 'Naziv postignuća', 'Opis uvjeta', 'Bodovi']],
      body: achievementsData,
      styles: { font: 'Roboto', fontSize: 9, textColor: textMain, cellPadding: 3.5 },
      headStyles: { fillColor: brandDark, fontStyle: 'bold', textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 55, fontStyle: 'bold' },
        2: { cellWidth: 88 },
        3: { cellWidth: 25, halign: 'center', textColor: [217, 119, 6], fontStyle: 'bold' }
      }
    });

    currentY = doc.lastAutoTable.finalY + 12;

    if (currentY > 220) {
      doc.addPage();
      currentY = 20;
    }

    // --- 3. TABLICA: POVIJEST MEČEVA ---
    doc.setFont('Roboto', 'bold');
    doc.setFontSize(11.5);
    doc.setTextColor(...textMain);
    doc.text('Povijest Mečeva', 15, currentY);
    currentY += 4;

    const history = Array.isArray(profile.matchHistory) ? profile.matchHistory : [];
    const historyData = history.length > 0
      ? history.map((m, idx) => {
          const isWin = m.isWin;
          return [
            (idx + 1).toString(),
            m.vs || 'Protivnik',
            { 
              content: isWin ? 'POBJEDA' : 'PORAZ', 
              styles: { textColor: isWin ? successGreen : errorRed, fontStyle: 'bold' } 
            },
            m.score || '-',
            m.date || '-'
          ];
        })
      : [['-', 'Nema zabilježenih mečeva.', '-', '-', '-']];

    autoTable(doc, {
      startY: currentY,
      margin: { left: 15, right: 15 },
      head: [['#', 'Protivnik', 'Ishod', 'Bodovi', 'Datum']],
      body: historyData,
      styles: { font: 'Roboto', fontSize: 9, textColor: textMain, cellPadding: 3.5 },
      headStyles: { fillColor: brandDark, fontStyle: 'bold', textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 60, fontStyle: 'bold' },
        2: { cellWidth: 35, halign: 'center' },
        3: { cellWidth: 30, halign: 'center' },
        4: { cellWidth: 43, halign: 'center' }
      }
    });

    // --- PODNOŽJE (FOOTER) SA STRANICAMA ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.4);
      doc.line(15, doc.internal.pageSize.getHeight() - 15, 195, doc.internal.pageSize.getHeight() - 15);

      doc.setFont('Roboto', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...textMuted);
      doc.text(
        `Aplikacija Mlin • Službeni izvještaj`,
        15,
        doc.internal.pageSize.getHeight() - 8
      );
      doc.text(
        `Stranica ${i} od ${pageCount}`,
        doc.internal.pageSize.getWidth() - 15,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'right' }
      );
    }

    // --- PREGLED U NOVOM TABU ---
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

  } catch (error) {
    console.error('Greška pri generiranju PDF-a:', error);
    alert('Došlo je do greške prilikom generiranja PDF-a. Provjerite konzolu.');
  }
};