// src/utils/pdfExport.js
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { getLocalizedAchievement } from '../achievementsData'; // Uvezi funkciju za prijevod postignuća

const RANK_STEPS = [
  { min: 0, hr: 'Bronca III', en: 'Bronze III' },
  { min: 50, hr: 'Bronca II', en: 'Bronze II' },
  { min: 120, hr: 'Bronca I', en: 'Bronze I' },
  { min: 200, hr: 'Srebro III', en: 'Silver III' },
  { min: 300, hr: 'Srebro II', en: 'Silver II' },
  { min: 420, hr: 'Srebro I', en: 'Silver I' },
  { min: 560, hr: 'Zlato III', en: 'Gold III' },
  { min: 720, hr: 'Zlato II', en: 'Gold II' },
  { min: 900, hr: 'Zlato I', en: 'Gold I' },
  { min: 1100, hr: 'Platina III', en: 'Platinum III' },
  { min: 1350, hr: 'Platina II', en: 'Platinum II' },
  { min: 1600, hr: 'Platina I', en: 'Platinum I' },
  { min: 1900, hr: 'Dijamant III', en: 'Diamond III' },
  { min: 2250, hr: 'Dijamant II', en: 'Diamond II' },
  { min: 2650, hr: 'Dijamant I', en: 'Diamond I' },
  { min: 3100, hr: 'Majstor', en: 'Master' },
  { min: 3800, hr: 'Velemajstor', en: 'Grandmaster' }
];

const getRankName = (points, lang = 'hr') => {
  let rank = RANK_STEPS[0];
  for (let r of RANK_STEPS) {
    if (points >= r.min) rank = r;
    else break;
  }
  return lang === 'hr' ? rank.hr : rank.en;
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

export const exportProfileToPDF = async (profile, achievementsCatalog = [], lang = 'hr') => {
  try {
    if (!profile) {
      alert(lang === 'en' ? 'No profile data found.' : 'Nema podataka o profilu.');
      return;
    }

    const isEn = lang === 'en';

    // Dvojezični labeli i tekstovi za PDF
    const l = {
      headerTitle: isEn ? 'MILL - OFFICIAL PROFILE REPORT' : 'MLIN - SLUŽBENI IZVJEŠTAJ PROFILA',
      generated: isEn ? 'Generated:' : 'Generirano:',
      gameName: isEn ? "Nine Men's Morris" : "Nine Men's Morris",
      player: isEn ? 'Player' : 'Igrač',
      rank: isEn ? 'Rank' : 'Rang',
      status: isEn ? 'Status' : 'Status',
      defaultBio: isEn ? 'Ready for game!' : 'Spreman za igru!',
      totalPoints: isEn ? 'Total Points' : 'Ukupno Bodova',
      ptUnit: isEn ? 'P' : 'B',
      matchesPlayed: isEn ? 'Matches Played' : 'Odigrani Mečevi',
      wins: isEn ? 'Wins' : 'Pobjede',
      losses: isEn ? 'Losses' : 'Porazi',
      winRate: isEn ? 'Win Rate' : 'Win Rate',
      achievementsTitle: isEn ? 'Unlocked Achievements' : 'Osvojena Postignuća',
      achColNum: '#',
      achColName: isEn ? 'Achievement Name' : 'Naziv postignuća',
      achColDesc: isEn ? 'Description' : 'Opis uvjeta',
      achColPoints: isEn ? 'Points' : 'Bodovi',
      noAchievements: isEn ? 'Player has no achievements unlocked yet.' : 'Igrač još nema otključanih postignuća.',
      historyTitle: isEn ? 'Match History' : 'Povijest Mečeva',
      histColOpponent: isEn ? 'Opponent' : 'Protivnik',
      histColOutcome: isEn ? 'Outcome' : 'Ishod',
      histColPoints: isEn ? 'Points' : 'Bodovi',
      histColDate: isEn ? 'Date' : 'Datum',
      victory: isEn ? 'VICTORY' : 'POBJEDA',
      defeat: isEn ? 'DEFEAT' : 'PORAZ',
      noHistory: isEn ? 'No match history recorded.' : 'Nema zabilježenih mečeva.',
      footerApp: isEn ? 'Mill App • Official Report' : 'Aplikacija Mlin • Službeni izvještaj',
      page: isEn ? 'Page' : 'Stranica',
      of: isEn ? 'of' : 'od'
    };

    const [regBase64, boldBase64] = await Promise.all([
      fetchFontAsBase64('/fonts/Roboto-Regular.ttf'),
      fetchFontAsBase64('/fonts/Roboto-Bold.ttf')
    ]);

    const doc = new jsPDF();

    doc.addFileToVFS('Roboto-Regular.ttf', regBase64);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    doc.addFileToVFS('Roboto-Bold.ttf', boldBase64);
    doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');

    const brandDark = [15, 23, 42];
    const textMain = [30, 41, 59];
    const textMuted = [100, 116, 139];
    const successGreen = [22, 163, 74];
    const errorRed = [220, 38, 38];

    // --- ZAGLAVLJE DOKUMENTA ---
    doc.setFillColor(...brandDark);
    doc.rect(0, 0, 210, 32, 'F');

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(l.headerTitle, 15, 18);

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(`${l.generated} ${new Date().toLocaleDateString(isEn ? 'en-US' : 'hr-HR')} | ${l.gameName}`, 15, 25);

    // --- KARTICA S PODACIMA O IGRAČU ---
    let currentY = 42;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(15, currentY, 180, 22, 3, 3, 'FD');

    doc.setFont('Roboto', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...textMain);
    doc.text(`${l.player}: ${profile.name || (isEn ? 'Player' : 'Igrač')}`, 20, currentY + 8);

    doc.setFont('Roboto', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...textMuted);
    doc.text(`${l.rank}: ${getRankName(Number(profile.points) || 0, lang)}   |   ${l.status}: "${profile.bio || l.defaultBio}"`, 20, currentY + 15);

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
      head: [[l.totalPoints, l.matchesPlayed, l.wins, l.losses, l.winRate]],
      body: [[
        { content: `${points} ${l.ptUnit}`, styles: { fontStyle: 'bold', textColor: [37, 99, 235] } },
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
    doc.text(l.achievementsTitle, 15, currentY);
    currentY += 4;

    const userAchIds = Array.isArray(profile.achievements) ? profile.achievements : [];
    const catalog = Array.isArray(achievementsCatalog) ? achievementsCatalog : [];
    const unlockedAchievements = catalog.filter(a => userAchIds.includes(String(a.id).trim()));

    const achievementsData = unlockedAchievements.length > 0
      ? unlockedAchievements.map((rawA, idx) => {
        const a = getLocalizedAchievement(rawA, lang); // Prevodimo postignuće na odabrani jezik
        return [
          (idx + 1).toString(),
          a.title || a.name || (isEn ? 'Achievement' : 'Postignuće'),
          a.desc || a.description || '-',
          `+${a.points || 10} ${l.ptUnit}`
        ];
      })
      : [['-', l.noAchievements, '-', '-']];

    autoTable(doc, {
      startY: currentY,
      margin: { left: 15, right: 15 },
      head: [[l.achColNum, l.achColName, l.achColDesc, l.achColPoints]],
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
    doc.text(l.historyTitle, 15, currentY);
    currentY += 4;

    const history = Array.isArray(profile.matchHistory) ? profile.matchHistory : [];
    const historyData = history.length > 0
      ? history.map((m, idx) => {
        const isWin = m.isWin;
        return [
          (idx + 1).toString(),
          m.vs || (isEn ? 'Opponent' : 'Protivnik'),
          {
            content: isWin ? l.victory : l.defeat,
            styles: { textColor: isWin ? successGreen : errorRed, fontStyle: 'bold' }
          },
          m.score || '-',
          m.date || '-'
        ];
      })
      : [['-', l.noHistory, '-', '-', '-']];

    autoTable(doc, {
      startY: currentY,
      margin: { left: 15, right: 15 },
      head: [[l.achColNum, l.histColOpponent, l.histColOutcome, l.histColPoints, l.histColDate]],
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
        l.footerApp,
        15,
        doc.internal.pageSize.getHeight() - 8
      );
      doc.text(
        `${l.page} ${i} ${l.of} ${pageCount}`,
        doc.internal.pageSize.getWidth() - 15,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'right' }
      );
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(lang === 'en' ? 'Failed to generate PDF.' : 'Greška prilikom generiranja PDF-a.');
  }
};