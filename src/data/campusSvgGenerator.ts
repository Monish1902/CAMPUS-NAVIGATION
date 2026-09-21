/**
 * Generates an SVG representation of the MVGR Campus matching the user's Google Satellite Image.
 * Dimensions: 1000 x 1000
 * SVG Y is inverted from Campus Y: svgY = 1000 - campusY
 */

export function getCampusSvgString(options?: { highContrast?: boolean; mapStyle?: 'satellite' | 'vector' }): string {
  const isVector = options?.mapStyle === 'vector';
  const isHighContrast = options?.highContrast ?? false;

  // Palette definitions
  // 1. Photorealistic Satellite Palette (Default - directly sampled from the user's uploaded satellite image)
  const satTerrain = '#ad9576';
  const satPlot1 = '#988062';
  const satPlot2 = '#bfa889';
  const satPlot3 = '#8a7255';
  const satRoad = '#4f555e';
  const satRoadBorder = '#69707b';
  const satWalkway = '#baa993';
  const satCricketTrack = '#ba9c74';
  const satCricketTurf = '#9c8461';
  const satPond = '#1c4558';
  const satRoofConcrete = '#ded6cb';
  const satRoofSolar = '#142540';
  const satRoofTerracotta = '#a84c37';
  const satTreeDark = '#1b3b21';
  const satTreeMid = '#27522e';
  const satTreeLight = '#3a6d41';
  const blueTrail = '#2563eb';

  // 2. Vector Blueprint Palette
  const vecBg = isHighContrast ? '#0f172a' : '#f8fafc';
  const vecLawn = isHighContrast ? '#1e293b' : '#e2f0d9';
  const vecRoad = isHighContrast ? '#334155' : '#e2e8f0';
  const vecWalk = isHighContrast ? '#475569' : '#cbd5e1';

  if (isVector) {
    return generateVectorSvg({ vecBg, vecLawn, vecRoad, vecWalk, blueTrail, isHighContrast });
  }

  return generateSatelliteSvg({
    satTerrain,
    satPlot1,
    satPlot2,
    satPlot3,
    satRoad,
    satRoadBorder,
    satWalkway,
    satCricketTrack,
    satCricketTurf,
    satPond,
    satRoofConcrete,
    satRoofSolar,
    satRoofTerracotta,
    satTreeDark,
    satTreeMid,
    satTreeLight,
    blueTrail,
  });
}

function generateSatelliteSvg(c: Record<string, string>): string {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" id="mvgr-satellite-map">
    <defs>
      <!-- Ground Textures & Gradients -->
      <linearGradient id="satGroundGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c.satTerrain}"/>
        <stop offset="50%" stop-color="${c.satPlot2}"/>
        <stop offset="100%" stop-color="${c.satPlot1}"/>
      </linearGradient>

      <linearGradient id="satPondGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2a5d74"/>
        <stop offset="60%" stop-color="${c.satPond}"/>
        <stop offset="100%" stop-color="#123242"/>
      </linearGradient>

      <linearGradient id="cricketOvalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c.satCricketTurf}"/>
        <stop offset="50%" stop-color="#ab9370"/>
        <stop offset="100%" stop-color="${c.satCricketTurf}"/>
      </linearGradient>

      <!-- Solar Panel Grid Pattern -->
      <pattern id="satSolarPattern" width="7" height="4" patternUnits="userSpaceOnUse">
        <rect width="7" height="4" fill="${c.satRoofSolar}" stroke="#29538a" stroke-width="0.5"/>
        <line x1="3.5" y1="0" x2="3.5" y2="4" stroke="#3b82f6" stroke-width="0.3"/>
      </pattern>

      <!-- Concrete Roof Texture Pattern -->
      <pattern id="concretePattern" width="12" height="12" patternUnits="userSpaceOnUse">
        <rect width="12" height="12" fill="${c.satRoofConcrete}"/>
        <line x1="0" y1="6" x2="12" y2="6" stroke="#cfc5b6" stroke-width="0.5"/>
        <line x1="6" y1="0" x2="6" y2="12" stroke="#cfc5b6" stroke-width="0.5"/>
      </pattern>

      <!-- Drop Shadows for 3D Building Rooftops -->
      <filter id="bldgShadow" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="3" dy="5" stdDeviation="4" flood-color="#000000" flood-opacity="0.45"/>
      </filter>

      <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#000000" flood-opacity="0.9"/>
      </filter>
    </defs>

    <!-- 1. BASE SATELLITE TERRAIN & AGRICULTURAL FIELDS -->
    <rect width="1000" height="1000" fill="url(#satGroundGrad)"/>

    <!-- Soil variations & fields matching satellite photo -->
    <polygon points="0,0 350,0 260,180 0,220" fill="${c.satPlot1}" opacity="0.7"/>
    <polygon points="700,0 1000,0 1000,320 760,260" fill="${c.satPlot3}" opacity="0.6"/>
    <polygon points="0,700 0,1000 320,1000 240,780" fill="${c.satPlot2}" opacity="0.5"/>
    <polygon points="800,700 1000,650 1000,1000 750,1000" fill="${c.satPlot1}" opacity="0.75"/>

    <!-- Subtle satellite field patch strips -->
    <rect x="20" y="40" width="140" height="80" fill="${c.satPlot2}" opacity="0.4" rx="4"/>
    <rect x="180" y="30" width="80" height="100" fill="${c.satPlot3}" opacity="0.4" rx="4"/>
    <rect x="740" y="40" width="220" height="120" fill="${c.satPlot1}" opacity="0.45" rx="6"/>

    <!-- 2. ROADS & HIGHWAYS -->
    <!-- South Highway Road (Shivalayam & Umamaheswara frontage) -->
    <!-- svgY: 920 to 1000 -->
    <path d="M-50,960 L1050,890 L1050,980 L-50,1050 Z" fill="${c.satRoad}" stroke="${c.satRoadBorder}" stroke-width="2"/>
    <path d="M-50,975 L1050,905" stroke="#fef08a" stroke-width="2" stroke-dasharray="16 12" opacity="0.8"/>

    <!-- Main Entrance Road from Highway to Admin Roundabout -->
    <!-- svg: (455, 940) -> (455, 530) -->
    <path d="M445,950 L445,530 L465,530 L465,950 Z" fill="${c.satRoad}" stroke="${c.satRoadBorder}" stroke-width="1.5"/>

    <!-- Curved Promenade encircling the Cricket Ground (East & West) -->
    <ellipse cx="550" cy="760" rx="160" ry="125" fill="none" stroke="${c.satRoad}" stroke-width="14"/>
    <ellipse cx="550" cy="760" rx="160" ry="125" fill="none" stroke="${c.satRoadBorder}" stroke-width="1"/>

    <!-- East Ring Road connecting Central Library, Civil/EEE, Canteen, and Data Engineering -->
    <path d="M465,530 C580,530 680,540 730,500 L730,220 C750,200 820,190 920,190"
          fill="none" stroke="${c.satRoad}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>

    <!-- North Road connecting Mech, Workshop, and Data Engineering -->
    <path d="M340,90 L520,90 L760,110 L875,175"
          fill="none" stroke="${c.satRoad}" stroke-width="10" stroke-linecap="round"/>

    <!-- Central Walkway Corridors between Admin, CSE, ECE, and Mech -->
    <path d="M455,530 L455,360 L430,240 L340,110"
          fill="none" stroke="${c.satWalkway}" stroke-width="8" stroke-linecap="round"/>

    <!-- Cross Corridor to IT and Chemistry Lab -->
    <path d="M455,490 L605,435 L650,330"
          fill="none" stroke="${c.satWalkway}" stroke-width="8" stroke-linecap="round"/>

    <!-- Authentic Blue Traced Walking Trail (along West curve of Cricket Ground) -->
    <!-- Traced along the blue dots from the reference images -->
    <path d="M455,880 Q430,830 390,780 Q360,730 355,670 Q370,610 395,560 Q435,525 455,490"
          fill="none" stroke="${c.blueTrail}" stroke-width="4.5" stroke-dasharray="6 4" stroke-linecap="round"/>

    <!-- 3. SPORTS GROUNDS & POND -->
    <!-- A. Cricket Ground Oval (Center: 550, 760) -->
    <g id="sat-cricket-ground">
      <!-- Dirt running track ring -->
      <ellipse cx="550" cy="760" rx="145" ry="110" fill="${c.satCricketTrack}" stroke="#a3855e" stroke-width="2"/>
      <!-- Inner turf field -->
      <ellipse cx="550" cy="760" rx="125" ry="92" fill="url(#cricketOvalGrad)" stroke="#8e7655" stroke-width="1"/>
      <!-- 30-yard circle -->
      <ellipse cx="550" cy="760" rx="70" ry="50" fill="none" stroke="#e0d1bb" stroke-width="1" stroke-dasharray="5 4" opacity="0.65"/>
      <!-- Cricket pitch wicket strip -->
      <rect x="542" y="740" width="16" height="40" fill="#f0e5d3" stroke="#8a7353" stroke-width="1" rx="2"/>
    </g>

    <!-- B. Basketball & Volleyball Courts (350, 530) -->
    <g id="sat-courts" filter="url(#bldgShadow)">
      <rect x="315" y="505" width="60" height="50" fill="#2d6a4f" stroke="#1b4332" stroke-width="1.5" rx="3"/>
      <rect x="320" y="510" width="50" height="40" fill="none" stroke="#d8f3dc" stroke-width="1"/>
      <circle cx="345" cy="530" r="6" fill="none" stroke="#d8f3dc" stroke-width="1"/>
    </g>

    <!-- C. Pond / పాండ్ (730, 920) -->
    <g id="sat-pond" filter="url(#bldgShadow)">
      <path d="M670,880 C720,860 800,870 810,915 C820,955 765,980 705,975 C660,965 645,910 670,880 Z"
            fill="url(#satPondGrad)" stroke="#112d3b" stroke-width="2.5"/>
      <!-- Water ripples -->
      <path d="M700,900 C730,895 760,900 780,915" stroke="#7dd3fc" stroke-width="1.5" fill="none" opacity="0.6"/>
      <path d="M685,930 C715,925 750,930 770,945" stroke="#7dd3fc" stroke-width="1.5" fill="none" opacity="0.6"/>
    </g>

    <!-- 4. SATELLITE TREE CANOPIES (CLUSTERS MATCHING SATELLITE IMAGE) -->
    <g id="sat-trees" opacity="0.9">
      <!-- Pond perimeter trees -->
      <circle cx="660" cy="875" r="11" fill="${c.satTreeDark}"/>
      <circle cx="685" cy="860" r="9" fill="${c.satTreeMid}"/>
      <circle cx="780" cy="865" r="12" fill="${c.satTreeDark}"/>
      <circle cx="815" cy="900" r="13" fill="${c.satTreeLight}"/>
      <circle cx="800" cy="955" r="12" fill="${c.satTreeDark}"/>
      <circle cx="750" cy="980" r="10" fill="${c.satTreeMid}"/>
      <circle cx="685" cy="970" r="11" fill="${c.satTreeDark}"/>

      <!-- Cricket Oval perimeter trees -->
      <circle cx="410" cy="740" r="10" fill="${c.satTreeMid}"/>
      <circle cx="395" cy="700" r="11" fill="${c.satTreeDark}"/>
      <circle cx="400" cy="650" r="12" fill="${c.satTreeLight}"/>
      <circle cx="410" cy="800" r="11" fill="${c.satTreeDark}"/>
      <circle cx="440" cy="850" r="12" fill="${c.satTreeMid}"/>
      <circle cx="660" cy="840" r="11" fill="${c.satTreeDark}"/>
      <circle cx="690" cy="800" r="12" fill="${c.satTreeLight}"/>
      <circle cx="700" cy="740" r="13" fill="${c.satTreeMid}"/>
      <circle cx="695" cy="680" r="12" fill="${c.satTreeDark}"/>

      <!-- Admin Block frontage gardens and trees -->
      <circle cx="430" cy="535" r="11" fill="${c.satTreeLight}"/>
      <circle cx="485" cy="535" r="12" fill="${c.satTreeDark}"/>
      <circle cx="455" cy="560" r="10" fill="${c.satTreeMid}"/>
      <circle cx="510" cy="540" r="11" fill="${c.satTreeDark}"/>

      <!-- Quadrangle and inter-building tree groves -->
      <circle cx="330" cy="640" r="12" fill="${c.satTreeDark}"/>
      <circle cx="320" cy="590" r="11" fill="${c.satTreeMid}"/>
      <circle cx="485" cy="650" r="13" fill="${c.satTreeLight}"/>
      <circle cx="510" cy="700" r="12" fill="${c.satTreeDark}"/>
      <circle cx="670" cy="590" r="13" fill="${c.satTreeMid}"/>
      <circle cx="680" cy="540" r="12" fill="${c.satTreeDark}"/>
      <circle cx="740" cy="630" r="14" fill="${c.satTreeLight}"/>
      <circle cx="840" cy="730" r="12" fill="${c.satTreeDark}"/>
      <circle cx="860" cy="700" r="11" fill="${c.satTreeMid}"/>
      <circle cx="760" cy="770" r="13" fill="${c.satTreeLight}"/>
    </g>

    <!-- 5. BUILDINGS TRACED DIRECTLY FROM GOOGLE SATELLITE IMAGE -->

    <!-- A. NEW BLOCK: DATA ENGINEERING BLOCK (Top-Right / North-East) -->
    <!-- campus: [800, 780] to [955, 875] -> svg: [800, 125] to [955, 220] -->
    <g id="bldg-data-engineering" filter="url(#bldgShadow)">
      <rect x="800" y="125" width="155" height="95" fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2" rx="3"/>
      <!-- Inner Courtyard -->
      <rect x="850" y="155" width="45" height="35" fill="${c.satTreeDark}" stroke="#8c7a65" stroke-width="1"/>
      <!-- Rooftop Solar Panel Arrays -->
      <rect x="815" y="132" width="125" height="15" fill="url(#satSolarPattern)"/>
      <rect x="815" y="198" width="125" height="15" fill="url(#satSolarPattern)"/>
    </g>

    <!-- B. MECHANICAL DEPARTMENT (Top-Center) -->
    <!-- campus: [275, 860] to [405, 960] -> svg: [275, 40] to [405, 140] -->
    <g id="bldg-mech" filter="url(#bldgShadow)">
      <rect x="275" y="40" width="130" height="100" fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2" rx="3"/>
      <!-- Courtyard -->
      <rect x="320" y="70" width="40" height="40" fill="${c.satTreeDark}" stroke="#786650" stroke-width="1"/>
    </g>

    <!-- C. WORKSHOP LABORATORY (North, East of Mech) -->
    <!-- campus: [410, 820] to [530, 885] -> svg: [410, 115] to [530, 180] -->
    <g id="bldg-workshop" filter="url(#bldgShadow)">
      <rect x="410" y="115" width="120" height="65" fill="${c.satRoofTerracotta}" stroke="#6e2d1d" stroke-width="2" rx="3"/>
      <!-- Rooftop Solar Arrays -->
      <rect x="420" y="123" width="95" height="14" fill="url(#satSolarPattern)"/>
      <rect x="420" y="153" width="95" height="14" fill="url(#satSolarPattern)"/>
    </g>

    <!-- D. ECE DEPARTMENT -->
    <!-- campus: [375, 710] to [485, 810] -> svg: [375, 190] to [485, 290] -->
    <g id="bldg-ece" filter="url(#bldgShadow)">
      <rect x="375" y="190" width="110" height="100" fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2" rx="3"/>
      <!-- Courtyard -->
      <rect x="415" y="225" width="30" height="30" fill="${c.satTreeDark}" stroke="#786650" stroke-width="1"/>
      <!-- Solar Arrays -->
      <rect x="385" y="200" width="85" height="16" fill="url(#satSolarPattern)"/>
      <rect x="385" y="265" width="85" height="16" fill="url(#satSolarPattern)"/>
    </g>

    <!-- E. CSE BLOCK (Central, South of ECE, North of Admin) -->
    <!-- campus: [340, 590] to [450, 690] -> svg: [340, 310] to [450, 410] -->
    <g id="bldg-cse-central" filter="url(#bldgShadow)">
      <rect x="340" y="310" width="110" height="100" fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2" rx="3"/>
      <!-- Courtyard -->
      <rect x="375" y="345" width="35" height="35" fill="${c.satTreeMid}" stroke="#786650" stroke-width="1"/>
      <!-- Solar Arrays -->
      <rect x="350" y="320" width="85" height="15" fill="url(#satSolarPattern)"/>
      <rect x="350" y="388" width="85" height="15" fill="url(#satSolarPattern)"/>
    </g>

    <!-- F. CSE BLOCK (West Wing, Northwest Edge) -->
    <!-- campus: [30, 810] to [85, 960] -> svg: [30, 40] to [85, 190] -->
    <g id="bldg-cse-west" filter="url(#bldgShadow)">
      <rect x="30" y="40" width="55" height="150" fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2" rx="2"/>
    </g>

    <!-- G. CHEMISTRY LABORATORY -->
    <!-- campus: [580, 640] to [720, 700] -> svg: [580, 300] to [720, 360] -->
    <g id="bldg-chemistry" filter="url(#bldgShadow)">
      <rect x="580" y="300" width="140" height="60" fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2" rx="3"/>
      <rect x="595" y="315" width="105" height="15" fill="url(#satSolarPattern)"/>
    </g>

    <!-- H. IT DEPARTMENT -->
    <!-- campus: [555, 515] to [655, 615] -> svg: [555, 385] to [655, 485] -->
    <g id="bldg-it" filter="url(#bldgShadow)">
      <rect x="555" y="385" width="100" height="100" fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2" rx="3"/>
      <!-- Courtyard -->
      <rect x="590" y="420" width="30" height="30" fill="${c.satTreeDark}" stroke="#786650" stroke-width="1"/>
      <!-- Solar Arrays -->
      <rect x="565" y="395" width="75" height="15" fill="url(#satSolarPattern)"/>
      <rect x="565" y="460" width="75" height="15" fill="url(#satSolarPattern)"/>
    </g>

    <!-- I. ADMIN BLOCK (Central Flagship) -->
    <!-- campus: [415, 475] to [535, 550] -> svg: [415, 450] to [535, 525] -->
    <g id="bldg-admin" filter="url(#bldgShadow)">
      <rect x="415" y="450" width="120" height="75" fill="url(#concretePattern)" stroke="#64748b" stroke-width="2.5" rx="3"/>
      <!-- Portico Steps -->
      <polygon points="455,525 495,525 500,535 450,535" fill="#94a3b8"/>
      <rect x="460" y="520" width="30" height="6" fill="#1e3a8a"/>
    </g>

    <!-- J. CANTEEN (Terracotta Roof North of Civil Block) -->
    <!-- campus: [750, 610] to [830, 665] -> svg: [750, 335] to [830, 390] -->
    <g id="bldg-canteen" filter="url(#bldgShadow)">
      <rect x="750" y="335" width="80" height="55" fill="${c.satRoofTerracotta}" stroke="#6e2d1d" stroke-width="2" rx="3"/>
      <rect x="760" y="345" width="60" height="12" fill="#c2573f" rx="1"/>
    </g>

    <!-- K. CIVIL, EEE, CHEM ENGINEERING BLOCK -->
    <!-- campus: [720, 460] to [840, 570] -> svg: [720, 430] to [840, 540] -->
    <g id="bldg-civil-eee-chem" filter="url(#bldgShadow)">
      <rect x="720" y="430" width="120" height="110" fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2.5" rx="3"/>
      <!-- Courtyard -->
      <rect x="760" y="465" width="35" height="35" fill="${c.satTreeMid}" stroke="#786650" stroke-width="1"/>
      <!-- Solar Arrays -->
      <rect x="735" y="440" width="85" height="16" fill="url(#satSolarPattern)"/>
      <rect x="735" y="512" width="85" height="16" fill="url(#satSolarPattern)"/>
    </g>

    <!-- L. CENTRAL LIBRARY (CENTRAL LIBRAY) - Crescent curved building -->
    <!-- campus: [665, 340] to [755, 420] -> svg: [665, 580] to [755, 660] -->
    <g id="bldg-central-library" filter="url(#bldgShadow)">
      <path d="M665,580 C705,570 735,575 755,595 L755,660 C725,645 690,645 665,660 Z"
            fill="url(#concretePattern)" stroke="#8c7a65" stroke-width="2.5"/>
      <rect x="680" y="600" width="60" height="16" fill="url(#satSolarPattern)"/>
    </g>

    <!-- M. OPEN AIR AUDITORIUM -->
    <g id="bldg-auditorium" filter="url(#bldgShadow)">
      <path d="M635,550 A 45 45 0 0 1 715,530 L695,505 A 25 25 0 0 0 655,520 Z"
            fill="#d1fae5" stroke="#059669" stroke-width="1.5"/>
    </g>

    <!-- N. TEMPLES (SOUTHWEST) -->
    <g id="temple-shivalayam" filter="url(#bldgShadow)">
      <circle cx="240" cy="960" r="14" fill="#fef08a" stroke="#ca8a04" stroke-width="2"/>
      <text x="240" y="964" font-size="12" text-anchor="middle" fill="#854d0e">ॐ</text>
    </g>
    <g id="temple-umamaheswara" filter="url(#bldgShadow)">
      <circle cx="230" cy="820" r="15" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
      <text x="230" y="825" font-size="13" text-anchor="middle" fill="#9a3412">ॐ</text>
    </g>

    <!-- 6. HIGH-CONTRAST SATELLITE ANNOTATION LABELS (IDENTICAL TO USER'S MAP) -->
    <g id="sat-labels" font-family="system-ui, -apple-system, sans-serif" font-weight="800" text-anchor="middle" filter="url(#textGlow)">
      <!-- Data Enginnering block (Top-Right) -->
      <g transform="translate(875, 115)">
        <text x="0" y="0" fill="#ffffff" font-size="13" stroke="#000000" stroke-width="3" paint-order="stroke fill">Data Enginnering block</text>
      </g>

      <!-- MECHANICAL Department Mech డిపార్ట్మెంట్ -->
      <g transform="translate(340, 32)">
        <text x="0" y="0" fill="#ffffff" font-size="13" stroke="#000000" stroke-width="3" paint-order="stroke fill">MECHANICAL</text>
        <text x="0" y="14" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill">Department Mech</text>
        <text x="0" y="27" fill="#fef08a" font-size="11" stroke="#000000" stroke-width="2" paint-order="stroke fill">డిపార్ట్మెంట్</text>
      </g>

      <!-- Workshop Labortary -->
      <g transform="translate(565, 138)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill">Workshop Labortary</text>
      </g>

      <!-- ECE Department -->
      <g transform="translate(420, 215)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill">ECE Department</text>
      </g>

      <!-- CSE BLOCK (Central) -->
      <g transform="translate(345, 395)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill" transform="rotate(-90, 0, 0)">CSE BLOCK</text>
      </g>

      <!-- CSE BLOCK (Northwest) -->
      <g transform="translate(58, 115)">
        <text x="0" y="0" fill="#ffffff" font-size="11" stroke="#000000" stroke-width="3" paint-order="stroke fill" transform="rotate(-90, 0, 0)">CSE BLOCK</text>
      </g>

      <!-- Chemistry Labortary -->
      <g transform="translate(650, 340)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill">Chemistry Labortary</text>
      </g>

      <!-- IT Department -->
      <g transform="translate(605, 388)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill">IT Department</text>
      </g>

      <!-- ADMIN BLOCK -->
      <g transform="translate(475, 520)">
        <text x="0" y="0" fill="#ffffff" font-size="13" stroke="#000000" stroke-width="3" paint-order="stroke fill">ADMIN BLOCK</text>
      </g>

      <!-- CANTEEN -->
      <g transform="translate(822, 355)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill" transform="rotate(90, 0, 0)">CANTEEN</text>
      </g>

      <!-- CIVIL, EEE, CHEM Enginnering block -->
      <g transform="translate(830, 515)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill" transform="rotate(90, 0, 0)">CIVIL, EEE, CHEM</text>
        <text x="0" y="14" fill="#ffffff" font-size="11" stroke="#000000" stroke-width="3" paint-order="stroke fill" transform="rotate(90, 0, 0)">Enginnering block</text>
      </g>

      <!-- CENTRAL LIBRAY -->
      <g transform="translate(705, 645)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill" transform="rotate(90, 0, 0)">CENTRAL LIBRAY</text>
      </g>

      <!-- MVGR.Engg College Main Gate -->
      <g transform="translate(585, 785)">
        <text x="0" y="0" fill="#ffffff" font-size="13" stroke="#000000" stroke-width="3" paint-order="stroke fill">MVGR.Engg</text>
        <text x="0" y="16" fill="#ffffff" font-size="13" stroke="#000000" stroke-width="3" paint-order="stroke fill">College Main Gate</text>
        <text x="0" y="32" fill="#fef08a" font-size="12" stroke="#000000" stroke-width="2.5" paint-order="stroke fill">మెయిన్ గేట్</text>
      </g>

      <!-- Pond / పాండ్ -->
      <g transform="translate(730, 915)">
        <text x="0" y="0" fill="#ffffff" font-size="13" stroke="#000000" stroke-width="3" paint-order="stroke fill">Pond</text>
        <text x="0" y="16" fill="#e0f2fe" font-size="12" stroke="#000000" stroke-width="2.5" paint-order="stroke fill">పాండ్</text>
      </g>

      <!-- Sri Sri Sri Umamaheswara... -->
      <g transform="translate(225, 790)">
        <text x="0" y="0" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill">Sri Sri Sri</text>
        <text x="0" y="14" fill="#ffffff" font-size="12" stroke="#000000" stroke-width="3" paint-order="stroke fill">Umamaheswara...</text>
        <text x="0" y="28" fill="#fef08a" font-size="11" stroke="#000000" stroke-width="2.5" paint-order="stroke fill">శ్రీ శ్రీ శ్రీ ఉమామహేశ్వర...</text>
      </g>

      <!-- Shivalayam -->
      <g transform="translate(270, 980)">
        <text x="0" y="0" fill="#ffffff" font-size="13" stroke="#000000" stroke-width="3" paint-order="stroke fill">Shivalayam</text>
      </g>
    </g>

    <!-- Google Map Style Graduation Cap Badges for Main Academic Hubs -->
    <g id="sat-badges">
      <!-- Admin Block Cap Badge -->
      <circle cx="475" cy="455" r="16" fill="#2563eb" stroke="#ffffff" stroke-width="2.5" filter="url(#bldgShadow)"/>
      <path d="M467,453 L475,449 L483,453 L475,457 Z" fill="#ffffff"/>
      <path d="M471,455 L471,459 C471,461 479,461 479,459 L479,455" fill="none" stroke="#ffffff" stroke-width="1"/>

      <!-- Mech Department Cap Badge -->
      <circle cx="450" cy="75" r="16" fill="#2563eb" stroke="#ffffff" stroke-width="2.5" filter="url(#bldgShadow)"/>
      <path d="M442,73 L450,69 L458,73 L450,77 Z" fill="#ffffff"/>
      <path d="M446,75 L446,79 C446,81 454,81 454,79 L454,75" fill="none" stroke="#ffffff" stroke-width="1"/>

      <!-- Main Gate Security Badge -->
      <circle cx="455" cy="900" r="16" fill="#059669" stroke="#ffffff" stroke-width="2.5" filter="url(#bldgShadow)"/>
      <path d="M449,897 L455,894 L461,897 L461,902 C461,906 455,908 455,908 C455,908 449,906 449,902 Z" fill="#ffffff"/>
    </g>

    <!-- Compass & Scale -->
    <g id="sat-compass" transform="translate(935, 75)">
      <circle cx="0" cy="0" r="20" fill="#0f172a" stroke="#cbd5e1" stroke-width="1.5" opacity="0.9"/>
      <polygon points="0,-15 4,0 0,-3 -4,0" fill="#ef4444"/>
      <polygon points="0,15 4,0 0,3 -4,0" fill="#cbd5e1"/>
      <text x="0" y="-18" fill="#ef4444" font-size="10" font-weight="900" text-anchor="middle" font-family="sans-serif">N</text>
    </g>
  </svg>
  `;
}

function generateVectorSvg(c: {
  vecBg: string;
  vecLawn: string;
  vecRoad: string;
  vecWalk: string;
  blueTrail: string;
  isHighContrast: boolean;
}): string {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000" id="mvgr-vector-map">
    <defs>
      <pattern id="vecSolarGrid" width="6" height="4" patternUnits="userSpaceOnUse">
        <rect width="6" height="4" fill="#1e3a8a" stroke="#3b82f6" stroke-width="0.5"/>
      </pattern>
      <filter id="vecShadow" x="-10%" y="-10%" width="125%" height="125%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.2"/>
      </filter>
    </defs>

    <rect width="1000" height="1000" fill="${c.vecBg}"/>
    <path d="M0,0 L1000,0 L1000,1000 L0,1000 Z" fill="${c.vecLawn}" opacity="0.6"/>

    <!-- Highway & Roads -->
    <path d="M-50,960 L1050,890 L1050,980 L-50,1050 Z" fill="${c.vecRoad}"/>
    <path d="M445,950 L445,530 L465,530 L465,950 Z" fill="${c.vecRoad}"/>
    <ellipse cx="550" cy="760" rx="160" ry="125" fill="none" stroke="${c.vecRoad}" stroke-width="12"/>

    <!-- Pond -->
    <path d="M670,880 C720,860 800,870 810,915 C820,955 765,980 705,975 C660,965 645,910 670,880 Z"
          fill="#38bdf8" stroke="#0284c7" stroke-width="2"/>

    <!-- Cricket Ground -->
    <ellipse cx="550" cy="760" rx="140" ry="105" fill="#fef3c7" stroke="#d97706" stroke-width="2"/>

    <!-- Blue Trail -->
    <path d="M455,880 Q430,830 390,780 Q360,730 355,670 Q370,610 395,560 Q435,525 455,490"
          fill="none" stroke="${c.blueTrail}" stroke-width="4" stroke-dasharray="6 4"/>

    <!-- Buildings -->
    <!-- Data Engineering -->
    <rect x="800" y="125" width="155" height="95" fill="#ffffff" stroke="#0284c7" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="875" y="175" fill="#0369a1" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Data Engineering Block</text>

    <!-- Mechanical -->
    <rect x="275" y="40" width="130" height="100" fill="#ffffff" stroke="#2563eb" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="340" y="95" fill="#1d4ed8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Mechanical Dept</text>

    <!-- Workshop -->
    <rect x="410" y="115" width="120" height="65" fill="#ffffff" stroke="#0284c7" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="470" y="150" fill="#0284c7" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Workshop Lab</text>

    <!-- ECE -->
    <rect x="375" y="190" width="110" height="100" fill="#ffffff" stroke="#2563eb" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="430" y="245" fill="#1d4ed8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">ECE Dept</text>

    <!-- CSE Central -->
    <rect x="340" y="310" width="110" height="100" fill="#ffffff" stroke="#2563eb" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="395" y="365" fill="#1d4ed8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">CSE Block</text>

    <!-- Admin -->
    <rect x="415" y="450" width="120" height="75" fill="#ffffff" stroke="#1e3a8a" stroke-width="2.5" rx="4" filter="url(#vecShadow)"/>
    <text x="475" y="490" fill="#1e3a8a" font-size="12" font-weight="bold" text-anchor="middle" font-family="sans-serif">ADMIN BLOCK</text>

    <!-- Chemistry -->
    <rect x="580" y="300" width="140" height="60" fill="#ffffff" stroke="#0284c7" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="650" y="335" fill="#0284c7" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Chemistry Lab</text>

    <!-- IT -->
    <rect x="555" y="385" width="100" height="100" fill="#ffffff" stroke="#2563eb" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="605" y="440" fill="#1d4ed8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">IT Dept</text>

    <!-- Canteen -->
    <rect x="750" y="335" width="80" height="55" fill="#fff7ed" stroke="#f97316" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="790" y="365" fill="#ea580c" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Canteen</text>

    <!-- Civil, EEE, Chem -->
    <rect x="720" y="430" width="120" height="110" fill="#ffffff" stroke="#2563eb" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="780" y="485" fill="#1d4ed8" font-size="10" font-weight="bold" text-anchor="middle" font-family="sans-serif">Civil, EEE, Chem</text>

    <!-- Central Library -->
    <rect x="665" y="580" width="90" height="80" fill="#ffffff" stroke="#2563eb" stroke-width="2" rx="4" filter="url(#vecShadow)"/>
    <text x="710" y="625" fill="#1d4ed8" font-size="11" font-weight="bold" text-anchor="middle" font-family="sans-serif">Central Library</text>
  </svg>
  `;
}
