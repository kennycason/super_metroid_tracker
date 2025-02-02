// Global state variables
let energyTanks = 0;
let missiles = 0;
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let currentView = 'type';
let currentNextItem = null;
let isGesturing = false;
let lastTouchDistance = 0;
let showAllItems = false;
let currentLanguage = 'en';

// Audio state
let currentTrack = 0;
let audio = null;
let isPlaying = false;
let isLooping = false;
let isMuted = true;

// Add PDF viewer state variables
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;

// Item type mappings
const itemShortCodes = {
    'morph_ball': 'mb',
    'bombs': 'b',
    'spring_ball': 'sb',
    'hi_jump': 'hj',
    'space_jump': 'sj',
    'speed_booster': 'spd',
    'grapple': 'gr',
    'xray': 'x',
    'varia_suit': 'vs',
    'gravity_suit': 'gs',
    'charge_beam': 'cb',
    'ice_beam': 'ib',
    'wave_beam': 'wb',
    'spazer_beam': 'spb',
    'plasma_beam': 'pb',
    'kraid': 'k',
    'phantoon': 'ph',
    'draygon': 'd',
    'ridley': 'r',
    'mother_brain': 'mb'
};

// Audio tracks configuration
const tracks = [
    { title: "Title", jpTitle: "タイトル", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/1%20-%20Intro.mp3" },
    { title: "Brinstar", jpTitle: "ブリンスタ", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/3%20-%20Brinstar.mp3" },
    { title: "Norfair", jpTitle: "ノルフェア ", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/4%20-%20Norfair.mp3" },
    { title: "Kraid", jpTitle: "クレイド", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/5%20-%20Kraid%27s%20Lair.mp3" },
    { title: "Ridley", jpTitle: "リドリー", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/6%20-%20Ridley%27s%20Lair.mp3" },
    { title: "Item Room", jpTitle: "アイテムルーム", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/7%20-%20Chozos.mp3" },
    { title: "Tourian", jpTitle: "ツーリアン", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/9%20-%20Tourian.mp3" },
    { title: "Zebetite", jpTitle: "ゼベタイト", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/10%20-%20Mother%20Brain.mp3" },
    { title: "Escape", jpTitle: "脱出", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/11%20-%20Quick%20Escape.mp3" },
    { title: "Ending", jpTitle: "エンディング", url: "https://fi.zophar.net/soundfiles/nintendo-nes-nsf/metroid/12%20-%20Mission%20Completed%20Successfully.mp3" }
];

// Group types for section ordering
const sectionOrder = ["bosses", "suits", "beams", "boots", "tools", "tanks", "ammo"];
const itemTypes = {
    "bosses": ["kraid", "phantoon", "draygon", "ridley", "mother_brain"],
    "suits": ["varia_suit", "gravity_suit"],
    "beams": ["charge_beam", "ice_beam", "wave_beam", "spazer_beam", "plasma_beam"],
    "boots": ["hi_jump", "space_jump", "speed_booster"],
    "tools": ["morph_ball", "bombs", "spring_ball", "grapple", "xray"],
    "tanks": ["energy", "reserve"],
    "ammo": ["missile", "super_missile", "power_bomb"]
};

const items = {
    // Bosses (1-5)
    1: {type: "kraid", x: 1885, y: 6882, area: "kraids_lair", name: "Kraid", jpName: "クレイド", order100Percent: 34},
    2: {type: "phantoon", x: 4201, y: 6805, area: "wrecked_ship", name: "Phantoon", jpName: "ファントゥーン", order100Percent: 41},
    3: {type: "draygon", x: 330, y: 2513, area: "maridia", name: "Draygon", jpName: "ドレイゴン", order100Percent: 45},
    4: {type: "ridley", x: 330, y: 2513, area: "norfair", name: "Ridley", jpName: "リドリー", order100Percent: 46},
    5: {type: "mother_brain", x: 330, y: 2513, area: "tourian", name: "Mother Brain", jpName: "マザーブレイン", order100Percent: 50},

    // Major Items (100-150)
    101: {type: "morph_ball", x: 360, y: 3270, area: "brinstar", name: "Morph Ball", jpName: "モーフボール", order100Percent: 1},
    102: {type: "bombs", x: 6264, y: 1016, area: "brinstar", name: "Bombs", jpName: "ボム", order100Percent: 6},
    103: {type: "spring_ball", x: 6777, y: 3896, area: "maridia", name: "Spring Ball", jpName: "スプリングボール", order100Percent: 25},
    104: {type: "hi_jump", x: 6777, y: 3896, area: "norfair", name: "Hi-Jump Boots", jpName: "ハイジャンプ", order100Percent: 10},
    105: {type: "space_jump", x: 3705, y: 296, area: "maridia", name: "Space Jump", jpName: "スペースジャンプ", order100Percent: 30},
    106: {type: "speed_booster", x: 3702, y: 3656, area: "norfair", name: "Speed Booster", jpName: "スピードブースター", order100Percent: 15},
    107: {type: "grapple", x: 1656, y: 1017, area: "norfair", name: "Grappling Beam", jpName: "グラップリングビーム", order100Percent: 20},
    108: {type: "xray", x: 4694, y: 8568, area: "brinstar", name: "X-Ray Scope", jpName: "Xレイスコープ", order100Percent: 22},
    109: {type: "varia_suit", x: 6523, y: 2696, area: "norfair", name: "Varia Suit", jpName: "バリアスーツ", order100Percent: 12},
    110: {type: "gravity_suit", x: 4470, y: 4856, area: "wrecked_ship", name: "Gravity Suit", jpName: "グラビティスーツ", order100Percent: 28},
    111: {type: "charge_beam", x: 6264, y: 1574, area: "brinstar", name: "Charge Beam", jpName: "チャージビーム", order100Percent: 5},
    112: {type: "ice_beam", x: 6440, y: 4390, area: "norfair", name: "Ice Beam", jpName: "アイスビーム", order100Percent: 18},
    113: {type: "wave_beam", x: 6776, y: 614, area: "norfair", name: "Wave Beam", jpName: "ウェーブビーム", order100Percent: 24},
    114: {type: "spazer_beam", x: 2408, y: 5140, area: "brinstar", name: "Spazer", jpName: "スペイザー", order100Percent: 16},
    115: {type: "plasma_beam", x: 2024, y: 6900, area: "maridia", name: "Plasma Beam", jpName: "プラズマビーム", order100Percent: 32},

    // Energy Tanks (201-214)
    201: {type: "energy", x: 100, y: 100, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 1},
    202: {type: "energy", x: 200, y: 200, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 2},
    203: {type: "energy", x: 300, y: 300, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 3},
    204: {type: "energy", x: 400, y: 400, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 4},
    205: {type: "energy", x: 500, y: 500, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 5},
    206: {type: "energy", x: 600, y: 600, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 6},
    207: {type: "energy", x: 700, y: 700, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 7},
    208: {type: "energy", x: 800, y: 800, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 8},
    209: {type: "energy", x: 900, y: 900, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 9},
    210: {type: "energy", x: 1000, y: 1000, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 10},
    211: {type: "energy", x: 1100, y: 1100, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 11},
    212: {type: "energy", x: 1200, y: 1200, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 12},
    213: {type: "energy", x: 1300, y: 1300, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 13},
    214: {type: "energy", x: 1400, y: 1400, area: "crateria", name: "Energy Tank", jpName: "エネルギータンク", order100Percent: 14},

    // Reserve Tanks (221-224)
    221: {type: "reserve", x: 300, y: 300, area: "brinstar", name: "Reserve Tank", jpName: "リザーブタンク", order100Percent: 10},
    222: {type: "reserve", x: 400, y: 400, area: "norfair", name: "Reserve Tank", jpName: "リザーブタンク", order100Percent: 20},
    223: {type: "reserve", x: 500, y: 500, area: "maridia", name: "Reserve Tank", jpName: "リザーブタンク", order100Percent: 30},
    224: {type: "reserve", x: 600, y: 600, area: "wrecked_ship", name: "Reserve Tank", jpName: "リザーブタンク", order100Percent: 40},

    // Missiles (301-346)
    301: {type: "missile", x: 100, y: 100, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 1},
    302: {type: "missile", x: 200, y: 200, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 2},
    303: {type: "missile", x: 300, y: 300, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 3},
    304: {type: "missile", x: 400, y: 400, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 4},
    305: {type: "missile", x: 500, y: 500, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 5},
    306: {type: "missile", x: 600, y: 600, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 6},
    307: {type: "missile", x: 700, y: 700, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 7},
    308: {type: "missile", x: 800, y: 800, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 8},
    309: {type: "missile", x: 900, y: 900, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 9},
    310: {type: "missile", x: 1000, y: 1000, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 10},
    311: {type: "missile", x: 1100, y: 1100, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 11},
    312: {type: "missile", x: 1200, y: 1200, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 12},
    313: {type: "missile", x: 1300, y: 1300, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 13},
    314: {type: "missile", x: 1400, y: 1400, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 14},
    315: {type: "missile", x: 1500, y: 1500, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 15},
    316: {type: "missile", x: 1600, y: 1600, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 16},
    317: {type: "missile", x: 1700, y: 1700, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 17},
    318: {type: "missile", x: 1800, y: 1800, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 18},
    319: {type: "missile", x: 1900, y: 1900, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 19},
    320: {type: "missile", x: 2000, y: 2000, area: "crateria", name: "Missile", jpName: "ミサイル", order100Percent: 20},

    // Super Missiles (401-410)
    401: {type: "super_missile", x: 100, y: 100, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 1},
    402: {type: "super_missile", x: 200, y: 200, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 2},
    403: {type: "super_missile", x: 300, y: 300, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 3},
    404: {type: "super_missile", x: 400, y: 400, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 4},
    405: {type: "super_missile", x: 500, y: 500, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 5},
    406: {type: "super_missile", x: 600, y: 600, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 6},
    407: {type: "super_missile", x: 700, y: 700, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 7},
    408: {type: "super_missile", x: 800, y: 800, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 8},
    409: {type: "super_missile", x: 900, y: 900, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 9},
    410: {type: "super_missile", x: 1000, y: 1000, area: "crateria", name: "Super Missile", jpName: "スーパーミサイル", order100Percent: 10},

    // Power Bombs (501-510)
    501: {type: "power_bomb", x: 100, y: 100, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 1},
    502: {type: "power_bomb", x: 200, y: 200, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 2},
    503: {type: "power_bomb", x: 300, y: 300, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 3},
    504: {type: "power_bomb", x: 400, y: 400, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 4},
    505: {type: "power_bomb", x: 500, y: 500, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 5},
    506: {type: "power_bomb", x: 600, y: 600, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 6},
    507: {type: "power_bomb", x: 700, y: 700, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 7},
    508: {type: "power_bomb", x: 800, y: 800, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 8},
    509: {type: "power_bomb", x: 900, y: 900, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 9},
    510: {type: "power_bomb", x: 1000, y: 1000, area: "crateria", name: "Power Bomb", jpName: "パワーボム", order100Percent: 10}
};

// Collection state array
const collectedItems = new Array(Object.keys(items).length).fill(false);

// Function definitions go OUTSIDE document.ready
function updateCounters() {
    let energyCount = 0;
    let missileCount = 0;
    let superMissileCount = 0;
    let powerBombCount = 0;
    let reserveCount = 0;

    Object.entries(items).forEach(([id, item]) => {
        if (collectedItems[id - 1]) {
            switch(item.type) {
                case 'energy':
                    energyCount++;
                    break;
                case 'missile':
                    missileCount++;
                    break;
                case 'super_missile':
                    superMissileCount++;
                    break;
                case 'power_bomb':
                    powerBombCount++;
                    break;
                case 'reserve':
                    reserveCount++;
                    break;
            }
        }
    });

    $('#energy-count').text(energyCount);
    $('#missile-count').text(missileCount);
    $('#super-missile-count').text(superMissileCount);
    $('#power-bomb-count').text(powerBombCount);
    $('#reserve-count').text(reserveCount);
}

function createItemOverlay() {
    $('#item-overlay').empty();
    
    Object.entries(items).forEach(([id, item]) => {
        const isCollected = collectedItems[id - 1];
        const isNextItem = currentView === '100' && currentNextItem && parseInt(id) === currentNextItem.id;
        
        if (isCollected || isNextItem || showAllItems) {
            const $marker = $('<div>', {
                class: `item-marker ${item.type}-marker${isCollected ? ' collected' : ''}${isNextItem ? ' next-item' : ''}`,
                'data-id': id,
                'data-original-left': `${item.x}px`,
                'data-original-top': `${item.y}px`
            }).css({
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`
            });

            const $sprite = $('<div>', {
                class: `sprite sprite-${item.type}${isNextItem ? ' next-item' : ''}`
            });

            $marker.append($sprite);
            $('#item-overlay').append($marker);

            $marker.on('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleItem(id - 1);
            });
        }
    });
}

function toggleItem(index) {
    const item = items[index + 1];
    if (!item) {
        console.error('Invalid item index:', index);
        return;
    }
    collectedItems[index] = !collectedItems[index];

    // Update UI
    $(`.item-entry[data-id="${index + 1}"]`).toggleClass('collected', collectedItems[index]);
    $(`.item-marker[data-id="${index + 1}"]`).toggleClass('collected', collectedItems[index]);

    updateCounters();
    if (currentView === '100') {
        updateNextItem();
    }

    // Save state
    saveState();
}

function checkItemSequence() {
    // Check if items are collected in the correct sequence
    // This is used for the 100% route view
    const sortedItems = Object.entries(items)
        .map(([id, item]) => ({id: parseInt(id), ...item}))
        .sort((a, b) => a.order100Percent - b.order100Percent);

    let isValid = true;
    let lastCollectedOrder = -1;

    sortedItems.forEach(item => {
        if (collectedItems[item.id - 1]) {
            if (item.order100Percent < lastCollectedOrder) {
                isValid = false;
            }
            lastCollectedOrder = item.order100Percent;
        }
    });

    return isValid;
}

function initializeMagnifier() {
    const $map = $('#metroid-map');
    const $mapContainer = $('.map-container');

    // Create magnifier element
    const $magnifier = $('<div>', {
        class: 'magnifier'
    }).appendTo($mapContainer);

    $mapContainer.on('mousemove', (e) => {
        const rect = $map[0].getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Position the magnifier
        $magnifier.css({
            left: `${x}px`,
            top: `${y}px`,
            display: 'block'
        });

        const magnifierSize = 200; // Should match the CSS width/height

        // Calculate the background position to center the zoomed area
        const bgX = -x * scale + magnifierSize / 2;
        const bgY = -y * scale + magnifierSize / 2;

        $magnifier.css({
            backgroundImage: `url(${$map.attr('src')})`,
            backgroundSize: `${rect.width * scale}px ${rect.height * scale}px`,
            backgroundPosition: `${bgX}px ${bgY}px`
        });
    });

    $mapContainer.on('mouseleave', () => {
        $magnifier.css('display', 'none');
    });
}

function initializeMapZoom() {
    const $map = $('#metroid-map');
    const $mapContainer = $('.map-container');
    const $overlay = $('#item-overlay');

    const minScale = 0.5;
    const maxScale = 16;  // This is now the single source of truth for max zoom
    let isHovering = false;
    let isDragging = false;
    let lastX, lastY;

    // Add hover detection
    $mapContainer.on('mouseenter', () => {
        isHovering = true;
        if (scale > 1) {
            $mapContainer.css('cursor', 'grab');
        } else {
            $mapContainer.css('cursor', 'zoom-in');
        }
    }).on('mouseleave', () => {
        isHovering = false;
        isDragging = false;
        $mapContainer.css('cursor', 'zoom-in');
    });

    // Add click handler for coordinate logging
    $mapContainer.on('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            return;
        }

        // Prevent default zoom behavior
        e.preventDefault();

        const rect = $mapContainer[0].getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const actualX = Math.round((mouseX - offsetX) / scale);
        const actualY = Math.round((mouseY - offsetY) / scale);

        console.log(`Clicked coordinates - x: ${actualX}, y: ${actualY}`);
    });

    // Add drag functionality for mouse
    $mapContainer.on('mousedown', (e) => {
        if (e.button === 1) {
            e.preventDefault();
        }

        if ((e.button === 0 || e.button === 1) && !e.ctrlKey && scale > 1) {
            isDragging = true;
            lastX = e.clientX;
            lastY = e.clientY;
            $mapContainer.css('cursor', 'grabbing');
            e.preventDefault();
        }
    });

    // Handle drag on window to catch fast movements
    $(window).on('mousemove', (e) => {
        if (!isDragging) return;

            const deltaX = e.clientX - lastX;
            const deltaY = e.clientY - lastY;
            lastX = e.clientX;
            lastY = e.clientY;

        offsetX += deltaX;
        offsetY += deltaY;

        applyTransformWithConstraints();
    });

    // Handle mouseup on window to catch releases outside container
    $(window).on('mouseup', (e) => {
        if ((e.button === 0 || e.button === 1)) {
            isDragging = false;
            if (isHovering) {
                $mapContainer.css('cursor', scale > 1 ? 'grab' : 'zoom-in');
            } else {
                $mapContainer.css('cursor', 'zoom-in');
            }
        }
    });

    // Add wheel zoom
    $mapContainer[0].addEventListener('wheel', (e) => {
        if (!$mapContainer.is(':hover')) return;

        e.preventDefault();

        const rect = $mapContainer[0].getBoundingClientRect();
        const $map = $('#metroid-map');
        const mapRect = $map[0].getBoundingClientRect();

        const mouseX = e.clientX - mapRect.left;
        const mouseY = e.clientY - mapRect.top;
        const pointX = mouseX / scale;
        const pointY = mouseY / scale;

        const scaleStep = 0.1;
        const oldScale = scale;

        if (e.deltaY < 0) {
            scale = Math.min(scale * (1 + scaleStep), maxScale);
        } else {
            scale = Math.max(scale * (1 - scaleStep), minScale);
        }

        offsetX += mouseX - (pointX * scale);
        offsetY += mouseY - (pointY * scale);

        applyTransformWithConstraints();
    }, {passive: false});

    // Add zoom button handlers
    $('.zoom-btn.zoom-in').on('click', () => handleZoomButton(true));
    $('.zoom-btn.zoom-out').on('click', () => handleZoomButton(false));
}

function handleZoomButton(isZoomIn) {
    const $mapContainer = $('.map-container');
    const $map = $('#metroid-map');
    const containerRect = $mapContainer[0].getBoundingClientRect();
    const mapRect = $map[0].getBoundingClientRect();

    // Calculate the point on the map in its natural coordinates
    const pointX = (containerRect.width / 2 - offsetX) / scale;
    const pointY = (containerRect.height / 2 - offsetY) / scale;

    const scaleStep = 0.4;
    const minScale = 0.5;
    const maxScale = 16;

    if (isZoomIn) {
        scale = Math.min(scale * (1 + scaleStep), maxScale);
    } else {
        scale = Math.max(scale * (1 - scaleStep), minScale);
    }

    // Calculate new offsets to keep the center point fixed
    offsetX = (containerRect.width / 2) - (pointX * scale);
    offsetY = (containerRect.height / 2) - (pointY * scale);

    applyTransformWithConstraints();
}

function initializeTouchGestures() {
    const $mapContainer = $('.map-container');
    let lastTouchX, lastTouchY;
    let isDragging = false;

    $mapContainer[0].addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            lastTouchX = e.touches[0].clientX;
            lastTouchY = e.touches[0].clientY;
        }
    }, {passive: true});

    $mapContainer[0].addEventListener('touchmove', (e) => {
        if (!isDragging || e.touches.length !== 1) return;

        e.preventDefault();
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastTouchX;
        const deltaY = touch.clientY - lastTouchY;

        offsetX += deltaX;
        offsetY += deltaY;

        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;

        applyTransformWithConstraints();
    }, {passive: false});

    $mapContainer[0].addEventListener('touchend', () => {
        isDragging = false;
    }, {passive: true});
}

function applyTransformWithConstraints() {
    const $map = $('#metroid-map');
    const $mapContainer = $('.map-container');

    // Apply transform without transition for smoother dragging
    const transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    $map.css({
        'transform-origin': '0 0',
        'transform': transform,
        'transition': 'none'
    });

    // Update overlay position to match map
    $('#item-overlay').css({
        'transform-origin': '0 0',
        'transform': transform
    });

    // Update individual markers with scaling that adjusts with zoom
    const maxSize = 32; // Maximum size (when zoomed out)
    const minSize = 8;  // Minimum size (when zoomed in)
    const scaleFactor = Math.max(minSize / maxSize, Math.min(1, 1 / scale));

    $('.item-marker').each(function () {
        const $marker = $(this);
        const markerTransform = `scale(${scaleFactor})`;

        // Only update the transform if it's different
        if ($marker.css('transform') !== markerTransform) {
            $marker.css({
                left: $marker.data('originalLeft') || $marker.css('left'),
                top: $marker.data('originalTop') || $marker.css('top'),
                transform: markerTransform,
                'transform-style': 'preserve-3d',
                'backface-visibility': 'hidden',
                'will-change': 'transform'
            });

            // Store original positions if not already stored
            if (!$marker.data('originalLeft')) {
                $marker.data('originalLeft', $marker.css('left'));
                $marker.data('originalTop', $marker.css('top'));
            }
        }
    });
}

function updateItemList() {
    const $itemsList = $('.items-list');
    $itemsList.empty();

    if (currentView === 'type') {
        // Group by type
        sectionOrder.forEach(section => {
            const $section = $('<div class="item-section">');
            const sectionItems = itemTypes[section];

            // Create section header
            const $header = $('<h3>').text(section.charAt(0).toUpperCase() + section.slice(1));
            $section.append($header);

            // Add items for this section
            Object.entries(items).forEach(([id, item]) => {
                if (sectionItems.includes(item.type)) {
                    const $entry = createItemEntry(id, item);
                    $section.append($entry);
                }
            });

            $itemsList.append($section);
        });
    } else {
        // Sort by 100% order
        const sortedItems = Object.entries(items)
            .sort((a, b) => a[1].order100Percent - b[1].order100Percent);

        sortedItems.forEach(([id, item]) => {
            const $entry = createItemEntry(id, item);
            $itemsList.append($entry);
        });
    }
}

function createItemEntry(id, item) {
    const $entry = $('<div>')
        .addClass('item-entry')
        .attr('data-id', id);

    const $sprite = $('<i>')
        .addClass(`sprite sprite-${item.type}`);

    const $text = $('<span>')
        .text(currentLanguage === 'en' ? item.name : item.jpName);

    return $entry
        .append($sprite)
        .append($text)
        .on('click', () => toggleItem(id - 1));
}

function updateTrackDisplay() {
    const $title = $('#trackTitle');
    const title = currentLanguage === 'en' ? tracks[currentTrack].title : tracks[currentTrack].jpTitle;
    $title.text(title);

    // Remove any existing animation
    $title.css('animation', 'none');

    // Force reflow
    void $title[0].offsetWidth;

    // Calculate animation duration based on text length
    const duration = Math.max(5, title.length * 0.3);

    // Add animation if text is too long
    if ($title.width() > $('.track-display').width()) {
        $title.css('animation', `scroll ${duration}s linear infinite`);
    }
}

function togglePlay() {
    console.log('togglePlay called, current isPlaying:', isPlaying);
    console.log('Current audio source:', audio.src);

    if (!audio.src) {
        console.log('Setting initial audio source to track:', tracks[currentTrack].title);
        audio.src = tracks[currentTrack].url;
        updateTrackDisplay();
    }

    if (isPlaying) {
        console.log('Pausing audio');
        audio.pause();
        isPlaying = false;
        $('#playPause').removeClass('active');
        $('#playPause').find('svg path').attr('d', 'M8 5v14l11-7z');
        $('#trackTitle').css('animation-play-state', 'paused');
    } else {
        console.log('Playing audio');
        audio.play().catch(err => {
            console.error('Failed to play audio:', err);
            // Add more detailed error information
            console.error('Audio state:', {
                currentTime: audio.currentTime,
                readyState: audio.readyState,
                networkState: audio.networkState,
                error: audio.error
            });
        });
        isPlaying = true;
        $('#playPause').addClass('active');
        $('#playPause').find('svg path').attr('d', 'M6 19h4V5H6v14zm8-14v14h4V5h-4z');
        $('#trackTitle').css('animation-play-state', 'running');
    }

    console.log('Play button state:', $('#playPause').hasClass('active'));
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    if (isPlaying) {
        audio.src = tracks[currentTrack].url;
        audio.play().catch(err => {
            console.error('Failed to play audio:', err);
        });
    } else {
        audio.src = tracks[currentTrack].url;
    }
    updateTrackDisplay();
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    if (isPlaying) {
        audio.src = tracks[currentTrack].url;
        audio.play().catch(err => {
            console.error('Failed to play audio:', err);
        });
    } else {
        audio.src = tracks[currentTrack].url;
    }
    updateTrackDisplay();
}

function toggleLoop() {
    isLooping = !isLooping;
    const $loopBtn = $('#loopTrack');
    if (isLooping) {
        $loopBtn.addClass('active');
    } else {
        $loopBtn.removeClass('active');
    }
}

function toggleVolume() {
    console.log('toggleVolume called, current isMuted:', isMuted);
    isMuted = !isMuted;
    const $volumeBtn = $('.volume-btn.standalone');

    if (isMuted) {
        console.log('Muting audio');
        audio.volume = 0;
        $('.retro-player').removeClass('visible');
        $volumeBtn.removeClass('active');
    } else {
        console.log('Unmuting audio');
        audio.volume = 1;
        $('.retro-player').addClass('visible');
        $volumeBtn.addClass('active');
    }

    updateVolumeIcon(isMuted);
    console.log('Volume button state:', $volumeBtn.hasClass('active'));
    console.log('Retro player visibility:', $('.retro-player').hasClass('visible'));
}

function updateVolumeIcon(muted) {
    const $volumeBtn = $('.volume-btn');
    if (muted) {
        $volumeBtn.find('svg path').attr('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
    } else {
        $volumeBtn.find('svg path').attr('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
    }
    $volumeBtn.toggleClass('active', !muted);
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'jp' : 'en';
    $('.lang-btn').text(currentLanguage === 'en' ? 'JP' : 'EN');
    $('.lang-btn').attr('title', `Switch to ${currentLanguage === 'en' ? 'Japanese' : 'English'}`);
    $('.stats-panel').toggleClass('jp', currentLanguage === 'jp');
    updateItemList();
    updateTrackDisplay();
    updateCreditsLanguage();
}

function renderPage(num) {
    pageRendering = true;
    console.log('Rendering page:', num);

    pdfDoc.getPage(num).then(function (page) {
        const viewport = page.getViewport({scale: scale});
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Clear previous content
        const container = document.getElementById('pdf-container');
        container.innerHTML = '';
        container.appendChild(canvas);

        const renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        page.render(renderContext).promise.then(function () {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });

        document.getElementById('page-num').textContent = num;
    });
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) return;
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) return;
    pageNum++;
    queueRenderPage(pageNum);
}

function updateCreditsLanguage() {
    $('.credits-section').removeClass('active');
    $(`.credits-section.${currentLanguage}`).addClass('active');
}

function updateNextItem() {
    if (currentView !== '100') {
        currentNextItem = null;
        return;
    }

    // If no items are collected, set Morphing Ball (ID: 100) as next item
    if (!collectedItems.some(item => item)) {
        currentNextItem = items[100];
        currentNextItem.id = 100;
        return;
    }

    const sortedItems = Object.entries(items)
        .map(([id, item]) => ({id: parseInt(id), ...item}))
        .sort((a, b) => a.order100Percent - b.order100Percent);

    const collectedOrders = sortedItems
        .filter(item => collectedItems[item.id - 1])
        .map(item => item.order100Percent);

    const lastCollectedOrder = Math.max(-1, ...collectedOrders);

    // Find first uncollected item after the last collected one
    currentNextItem = sortedItems.find(item =>
        !collectedItems[item.id - 1] &&
        item.order100Percent > lastCollectedOrder
    );
}

function saveState() {
    localStorage.setItem('superMetroidItems', JSON.stringify(collectedItems));
}

function loadState() {
    const saved = localStorage.getItem('superMetroidItems');
    if (saved) {
        const savedState = JSON.parse(saved);
        savedState.forEach((isCollected, index) => {
            if (isCollected) {
                toggleItem(index + 1);
            }
        });
    }
}

function generateShareUrl() {
    const collectedState = {
        items: {},
        missiles: [],
        energy: []
    };

    // Collect state
    Object.entries(items).forEach(([id, item]) => {
        if (collectedItems[id - 1]) {
            if (item.type === 'missile') {
                collectedState.missiles.push(parseInt(id) - 300);
            } else if (item.type === 'energy') {
                collectedState.energy.push(parseInt(id) - 200);
            } else if (item.type === 'ice_beam') {
                // Handle ice beams separately based on their IDs
                if (id === '106') { // Ice Beam Br
                    collectedState.items['ib'] = 1;
                } else if (id === '107') { // Ice Beam No
                    collectedState.items['ib2'] = 1;
                }
            } else if (itemShortCodes[item.type]) {
                collectedState.items[itemShortCodes[item.type]] = 1;
            }
        }
    });

    // Build URL parts manually to avoid escaping
    let urlParts = [];

    // Add items
    Object.entries(collectedState.items).forEach(([code, value]) => {
        urlParts.push(`${code}=${value}`);
    });

    // Add missiles and energy if any collected
    if (collectedState.missiles.length > 0) {
        urlParts.push(`m=${collectedState.missiles.join(',')}`);
    }
    if (collectedState.energy.length > 0) {
        urlParts.push(`e=${collectedState.energy.join(',')}`);
    }

    return `${window.location.origin}${window.location.pathname}?${urlParts.join('&')}`;
}

function loadStateFromUrl() {
    const params = new URLSearchParams(window.location.search);

    // Reset collection state
    collectedItems.fill(false);

    // Load regular items
    Object.entries(itemShortCodes).forEach(([type, code]) => {
        if (params.has(code)) {
            // Find and collect the item
            Object.entries(items).forEach(([id, item]) => {
                if (item.type === type) {
                    collectedItems[id - 1] = true;
                }
            });
        }
    });

    // Handle ice beams separately
    if (params.has('ib')) {
        // Collect Ice Beam Br
        collectedItems[106 - 1] = true;
    }
    if (params.has('ib2')) {
        // Collect Ice Beam No
        collectedItems[107 - 1] = true;
    }

    // Load missiles
    if (params.has('m')) {
        params.get('m').split(',').forEach(num => {
            const id = 300 + parseInt(num);
            if (items[id]) {
                collectedItems[id - 1] = true;
            }
        });
    }

    // Load energy tanks
    if (params.has('e')) {
        params.get('e').split(',').forEach(num => {
            const id = 200 + parseInt(num);
            if (items[id]) {
                collectedItems[id - 1] = true;
            }
        });
    }

    // Update display
    updateItemList();
    createItemOverlay();
}

function handleWheel(e) {
    const $mapContainer = $('.map-container');
    if (!$mapContainer.is(':hover') || isGesturing) return;

    e.preventDefault();

    const rect = $mapContainer[0].getBoundingClientRect();
    const $map = $('#metroid-map');
    const mapRect = $map[0].getBoundingClientRect();

    // Calculate mouse position relative to the map's visible area
    const mouseX = e.clientX - mapRect.left;
    const mouseY = e.clientY - mapRect.top;

    // Calculate the point on the map in its natural coordinates
    const pointX = mouseX / scale;
    const pointY = mouseY / scale;

    // Update scale
    const scaleStep = 0.1;
    const minScale = 0.5;
    const maxScale = 16;  // Updated to match button zoom

    const oldScale = scale;
    if (e.deltaY < 0) {
        scale = Math.min(scale * (1 + scaleStep), maxScale);
    } else {
        scale = Math.max(scale * (1 - scaleStep), minScale);
    }

    // Calculate new offsets to keep the mouse point fixed
    offsetX += mouseX - (pointX * scale);
    offsetY += mouseY - (pointY * scale);

    applyTransformWithConstraints();
}

function initializeMapControls() {
    const $mapContainer = $('.map-container');
    function initializeMapControls() {
        const $mapContainer = $('.map-container');
        let isDragging = false;
        let isHovering = false;
        let startX, startY;
        let lastOffsetX = offsetX;
        let lastOffsetY = offsetY;

        // Add mouse controls
        $mapContainer.on('mousedown', (e) => {
            if (e.button === 0 || e.button === 1) {
                isDragging = true;
                startX = e.clientX - offsetX;
                startY = e.clientY - offsetY;
                $mapContainer.css('cursor', 'grabbing');
            }
        });

        $mapContainer.on('mousemove', (e) => {
            isHovering = true;
            if (isDragging) {
                offsetX = e.clientX - startX;
                offsetY = e.clientY - startY;
                applyTransformWithConstraints();
            }
        });

        $mapContainer.on('mouseup', (e) => {
            if (e.button === 0 || e.button === 1) {
                isDragging = false;
                $mapContainer.css('cursor', scale > 1 ? 'grab' : 'zoom-in');
            }
        });

        $mapContainer.on('mouseleave', () => {
            isHovering = false;
            isDragging = false;
            $mapContainer.css('cursor', 'default');
        });

        // Add wheel zoom
        $mapContainer[0].addEventListener('wheel', handleWheel, { passive: false });

        // Add zoom button handlers
        $('.zoom-btn.zoom-in').on('click', () => handleZoomButton(true));
        $('.zoom-btn.zoom-out').on('click', () => handleZoomButton(false));
    }
}

function updateMapZoom() {
    const zoomLevel = scale;  // Your existing zoom logic
    
    // Apply zoom to markers
    $('.item-marker .sprite').css({
        transform: `scale(${2 * zoomLevel})`  // Base scale(2) * zoom level
    });
}

// Document ready goes at the bottom and contains initialization and event binding
$(document).ready(() => {
    // Initialize audio with error handling
    audio = new Audio();
    audio.volume = 0;  // Start muted

    // Set initial track
    audio.src = tracks[currentTrack].url;
    updateTrackDisplay();

    // Load state from URL if present
    loadStateFromUrl();

    // Add collapse button handler
    $('.collapse-btn').on('click', function () {
        const $panel = $('.stats-panel');
        const isCollapsed = $panel.hasClass('collapsed');

        // Recalculate marker positions immediately before the transition starts
        createItemOverlay();

        if (isCollapsed) {
            $panel.removeClass('collapsed');
            $(this).html('&lt;');
        } else {
            $panel.addClass('collapsed');
            $(this).html('&gt;');
        }

        // Recalculate again after the transition
        setTimeout(() => {
            createItemOverlay();
        }, 300); // Wait for panel animation to complete
    });

    // Add click handlers for audio controls
    $('.volume-btn').on('click', toggleVolume);
    $('#prevTrack').on('click', prevTrack);
    $('#playPause').on('click', togglePlay);
    $('#nextTrack').on('click', nextTrack);
    $('#loopTrack').on('click', toggleLoop);

    // Add manual button handler
    $('.manual-btn').on('click', () => {
        const pdfPath = currentLanguage === 'en' ? 'manual-en.pdf' : 'manual-jp.pdf';
        $('.manual-modal iframe').attr('src', pdfPath);
        $('.manual-modal').addClass('visible');
    });

    // Add close modal handler
    $('.close-modal').on('click', () => {
        $('.manual-modal').removeClass('visible');
    });

    // Close modal on escape key
    $(document).on('keydown', (e) => {
        if (e.key === 'Escape') {
            $('.manual-modal').removeClass('visible');
        }
    });

    // Close modal on click outside content
    $('.manual-modal').on('click', (e) => {
        if (e.target === e.currentTarget) {
            $('.manual-modal').removeClass('visible');
        }
    });

    // Add click handler for share button
    $('.share-btn').on('click', () => {
        const url = generateShareUrl();
        navigator.clipboard.writeText(url).then(() => {
            // Show notification
            const $notification = $('<div class="notification">Share URL copied to clipboard!</div>');
            $('body').append($notification);
            setTimeout(() => $notification.addClass('show'), 10);
            setTimeout(() => {
                $notification.removeClass('show');
                setTimeout(() => $notification.remove(), 300);
            }, 2000);
        });
    });

    // Add click handler for language toggle
    $('.lang-btn').on('click', toggleLanguage);

    // Add click handler for visibility toggle
    $('.visibility-btn').on('click', () => {
        showAllItems = !showAllItems;
        $('.visibility-btn').toggleClass('active', showAllItems);

        // Instead of recreating the entire overlay, just toggle visibility of markers
        Object.entries(items).forEach(([id, item]) => {
            const isCollected = collectedItems[id - 1];
            const isNextItem = currentView === '100' && currentNextItem && parseInt(id) === currentNextItem.id;
            const shouldShow = isCollected || isNextItem || showAllItems;

            const $existingMarker = $(`.item-marker[data-id="${id}"]`);

            if (shouldShow && !$existingMarker.length) {
                // Create new marker only if it doesn't exist and should be shown
                const $container = $('.map-container');
                const $map = $('#metroid-map');
                const mapNaturalWidth = $map[0].naturalWidth;
                const mapNaturalHeight = $map[0].naturalHeight;
                const containerRect = $container[0].getBoundingClientRect();

                const containerAspect = containerRect.width / containerRect.height;
                const mapAspect = mapNaturalWidth / mapNaturalHeight;

                let displayWidth, displayHeight;
                if (containerAspect > mapAspect) {
                    displayHeight = containerRect.height;
                    displayWidth = displayHeight * mapAspect;
                } else {
                    displayWidth = containerRect.width;
                    displayHeight = displayWidth / mapAspect;
                }

                const scaleX = displayWidth / mapNaturalWidth;
                const scaleY = displayHeight / mapNaturalHeight;

                let left, top;
                if (currentView === 'type') {
                    left = `${item.x * scaleX}px`;
                    top = `${item.y * scaleY}px`;
                } else {
                    left = `${item.x * scaleX}px`;
                    top = `${item.y * scaleY}px`;
                }

                // Calculate current scale factor
                const maxSize = 32;
                const minSize = 8;
                const scaleFactor = Math.max(minSize / maxSize, Math.min(1, 1 / scale));

                const $marker = $('<div>', {
                    class: `item-marker ${item.type}-marker${isCollected ? ' collected' : ''}${isNextItem ? ' next-item' : ''}`,
                    'data-id': id,
                    'data-original-left': left,
                    'data-original-top': top
                }).css({
                    position: 'absolute',
                    left: left,
                    top: top,
                    transform: `scale(${scaleFactor})`,
                    'transform-style': 'preserve-3d',
                    'backface-visibility': 'hidden',
                    'will-change': 'transform'
                });

                const $sprite = $('<div>', {
                    class: `sprite sprite-${item.type}${isNextItem ? ' next-item' : ''}`
                });

                $marker.append($sprite);
                $('#item-overlay').append($marker);

                $marker.on('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleItem(id - 1);
                });
            } else if (!shouldShow && $existingMarker.length) {
                // Remove marker if it exists but shouldn't be shown
                $existingMarker.remove();
            }
        });
    });

    updateCounters();
    checkItemSequence();
    updateItemList();
    initializeMapZoom();
    createItemOverlay();
    initializeTouchGestures();

    // Update during resize with debouncing
    let resizeTimeout;
    $(window).on('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createItemOverlay();
        }, 100);
    });

    // Add non-passive wheel event listener
    const mapContainer = document.querySelector('.map-container');
    mapContainer.addEventListener('wheel', handleWheel, {passive: false});

    // Add view toggle handler
    $('.toggle-btn').off('click').on('click', function (e) {
        const view = String($(this).data('view'));

        // Remove active class from all buttons and add to clicked one
        $('.toggle-btn').removeClass('active');
        $(this).addClass('active');

        // Set the view BEFORE calling other functions
        currentView = view;

        // Initialize next item for 100% view
        if (view === '100') {
            // Reset all items if none are collected
            if (!collectedItems.some(item => item)) {
                collectedItems.fill(false);
                currentNextItem = items[100];
                currentNextItem.id = 100;
            }
            updateNextItem();
        } else {
            currentNextItem = null;
        }

        updateItemList();
        createItemOverlay();
    });

    // Initialize view state based on active button
    const activeView = $('.toggle-btn.active').data('view');
    currentView = activeView || 'type';

    // Initialize next item if starting in 100% view
    if (currentView === '100') {
        if (!collectedItems.some(item => item)) {
            currentNextItem = items[100];
            currentNextItem.id = 100;
        }
        updateNextItem();
    }

    // Initialize audio with error handling
    audio.addEventListener('error', (e) => {
        console.error('Audio error:', {
            error: audio.error,
            code: audio.error ? audio.error.code : null,
            message: audio.error ? audio.error.message : null,
            currentSrc: audio.currentSrc,
            readyState: audio.readyState,
            networkState: audio.networkState
        });
    });

    // Add load start handler
    audio.addEventListener('loadstart', () => {
        console.log('Audio loading started');
    });

    // Add can play handler
    audio.addEventListener('canplay', () => {
        console.log('Audio can play');
    });

    // Add play handler
    audio.addEventListener('play', () => {
        console.log('Audio play event fired');
    });

    // Add PDF control handlers
    $('#prev-page').on('click', onPrevPage);
    $('#next-page').on('click', onNextPage);
    $('#zoom-in').on('click', () => {
        scale *= 1.2;
        renderPage(pageNum);
    });
    $('#zoom-out').on('click', () => {
        scale *= 0.8;
        renderPage(pageNum);
    });

    // Add credits modal handlers
    $('.placeholder-btn').on('click', () => {
        $('.credits-modal').addClass('visible');
        updateCreditsLanguage();
    });

    $('.credits-modal .close-modal').on('click', () => {
        $('.credits-modal').removeClass('visible');
    });

    // Close modal on escape key
    $(document).on('keydown', (e) => {
        if (e.key === 'Escape') {
            $('.credits-modal').removeClass('visible');
        }
    });

    // Close modal on click outside content
    $('.credits-modal').on('click', (e) => {
        if (e.target === e.currentTarget) {
            $('.credits-modal').removeClass('visible');
        }
    });

    initializeMapControls();

});
