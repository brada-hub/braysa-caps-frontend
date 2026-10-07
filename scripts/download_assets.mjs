import fs from 'fs';
import path from 'path';
import https from 'https';

const files = {
  'logo_ne.png': 'https://www.newera.com.ar/cdn/shop/files/logo_ne.png?v=1740157016',
  'banner_star_visor.webp': 'https://www.newera.com.ar/cdn/shop/files/BN-1440-580_16.webp?v=1789388612&width=1600',
  'banner_all_star.jpg': 'https://www.newera.com.ar/cdn/shop/files/BN-1440-580-_14.jpg?v=1787584694&width=1600',
  'banner_premium_baseball.webp': 'https://www.newera.com.ar/cdn/shop/files/BN-1440-580-2_8.webp?v=1784550555&width=1600',
  'banner_city_connect.webp': 'https://www.newera.com.ar/cdn/shop/files/BN-1440-580_11.webp?v=1784209075&width=1600',
  'silueta_59fifty.png': 'https://www.newera.com.ar/cdn/shop/files/NewEra_Siluetas_vectores_59fifty_copy_32x32.png?v=1745937355',
  'silueta_9forty.png': 'https://www.newera.com.ar/cdn/shop/files/9forty_250x200_c29bdd8f-39ce-4b7f-9819-06d43d9b69e8_32x32.png?v=1745935417',
  'silueta_39thirty.svg': 'https://www.newera.com.ar/cdn/shop/files/39thirty_32x32.svg?v=1745588041',
  'silueta_9fifty.png': 'https://www.newera.com.ar/cdn/shop/files/NewEra_Siluetas_vectores_9fifty_copy_32x32.png?v=1745937520',
  'p_rangers_1.jpg': 'https://www.newera.com.ar/cdn/shop/files/60915730_59FIFTY_MLB_TEXRAN_CHRM_BLK_3QL.jpg?v=1789156288&width=770',
  'p_rangers_2.jpg': 'https://www.newera.com.ar/cdn/shop/files/60915730_59FIFTY_MLB_TEXRAN_CHRM_BLK_R.jpg?v=1789156288&width=770',
  'p_bloom_ne_1.jpg': 'https://www.newera.com.ar/cdn/shop/files/60976998_3QL.jpg?v=1788449852&width=770',
  'p_bloom_ne_2.jpg': 'https://www.newera.com.ar/cdn/shop/files/60976998_3.jpg?v=1788449837&width=770',
  'p_sox_bloom_1.jpg': 'https://www.newera.com.ar/cdn/shop/files/60977000.jpg?v=1788449903&width=770',
  'p_sox_bloom_2.jpg': 'https://www.newera.com.ar/cdn/shop/files/60977000_3.jpg?v=1788449893&width=770',
  'p_yankees_pack_1.jpg': 'https://www.newera.com.ar/cdn/shop/files/60980272_59FIFTY_MLB_NEYYAN_NVY_3QL.jpg?v=1788449852&width=770',
  'p_yankees_pack_2.jpg': 'https://www.newera.com.ar/cdn/shop/files/60980272_59FIFTY_MLB_NEYYAN_NVY_R.jpg?v=1788449852&width=770',
  'p_dodgers_pack_1.jpg': 'https://www.newera.com.ar/cdn/shop/files/60980271_59FIFTY_MLB_AOE_SEASN_LOSDOD_BL_3QL.jpg?v=1788449903&width=770',
  'p_dodgers_pack_2.jpg': 'https://www.newera.com.ar/cdn/shop/files/60980271_59FIFTY_MLB_AOE_SEASN_LOSDOD_BL_R.jpg?v=1788449852&width=770',
  'p_athletics_1.jpg': 'https://www.newera.com.ar/cdn/shop/files/60915830_3QL.jpg?v=1788179463&width=770',
  'p_athletics_2.jpg': 'https://www.newera.com.ar/cdn/shop/files/60915830_6.jpg?v=1788179453&width=770',
  'p_recycled_dodgers.jpg': 'https://www.newera.com.ar/cdn/shop/files/60915747.jpg?v=1789156356&width=770',
  'p_recycled_yankees.jpg': 'https://www.newera.com.ar/cdn/shop/files/60915778.jpg?v=1789156330&width=770',
  'p_star_visor_dodgers.jpg': 'https://www.newera.com.ar/cdn/shop/files/60871848_3.jpg?v=1788449864&width=770',
  'p_yankees_red.jpg': 'https://www.newera.com.ar/cdn/shop/files/11591122_59FIFTY_MELTON_NEYYAN_SCA_3QL.jpg?v=1746047082&width=770',
  'p_yankees_navy.jpg': 'https://www.newera.com.ar/cdn/shop/files/70331909_70360398_59FIFTY_MLBAC2017GM_NEYYAN_OTC_3QL.jpg?v=1746047083&width=770',
  'p_yankees_black.jpg': 'https://www.newera.com.ar/cdn/shop/files/11591128_11941954_59FIFTY_MLBBASICFITTED_NEYYAN_BLKBLK_3QL.jpg?v=1746047082&width=770',
  'p_dodgers_blue.jpg': 'https://www.newera.com.ar/cdn/shop/files/70331962_59FIFTY_ACPERFGM2017_LOSDOD_OTC_3QL.jpg?v=1746047071&width=770',
  'p_dodgers_black.jpg': 'https://www.newera.com.ar/cdn/shop/files/11591150.jpg?v=1746047072&width=770',
  'p_3930_yankees.jpg': 'https://www.newera.com.ar/cdn/shop/files/10975804_39THIRTY_TEAMCLASSIC_NEYYAN_GM_3QL.jpg?v=1746047086&width=770',
  'p_3930_dodgers.jpg': 'https://www.newera.com.ar/cdn/shop/files/10975815_39THIRTY_TEAMCLASSIC_LOSDOD_GM_3QL.jpg?v=1746047085&width=770',
  'p_food_icon.jpg': 'https://www.newera.com.ar/cdn/shop/files/60667637.jpg?v=1746046971&width=770',
  'p_bad_bunny.jpg': 'https://www.newera.com.ar/cdn/shop/files/15198879.jpg?v=1779373960&width=770',
  'card_59fifty.webp': 'https://www.newera.com.ar/cdn/shop/files/11_a40e21ee-815c-422e-88a2-0f7308c04bc4_5_11zon.webp?v=1774974210&width=600',
  'card_mujer.png': 'https://www.newera.com.ar/cdn/shop/files/12_783514fe-363d-4b92-8115-5485ace460de.png?v=1772197903&width=600',
  'card_accesorios.webp': 'https://www.newera.com.ar/cdn/shop/files/card_new_era_5_54_11zon.webp?v=1774974210&width=600',
  'card_tiendas.webp': 'https://www.newera.com.ar/cdn/shop/files/card_new_era_6_4_11zon.webp?v=1774974210&width=600',
  'blog_mlb.webp': 'https://www.newera.com.ar/cdn/shop/articles/MLBASG-Blog-833x475.webp?v=1788907166&width=860',
  'blog_outfit.webp': 'https://www.newera.com.ar/cdn/shop/articles/LL_NEW_ERA_LIFESTYLE_0894_-_Hero_desktop_38992a4c-929f-4690-82ee-955bcadb6901.webp?v=1790346260&width=860',
  'blog_streetwear.webp': 'https://www.newera.com.ar/cdn/shop/articles/Blog-844x475.webp?v=1786625928&width=860',
  'logo_box_wht.png': 'https://www.newera.com.ar/cdn/shop/files/NEC_Logo_Primary_CMYK_Box_WHT.png?v=1746037216&width=200',
  'logo_linear_wht.png': 'https://www.newera.com.ar/cdn/shop/files/NEC_Logo_Primary_RGB_Linear_WHT_1.png?v=1787317135&width=280',
};

const targetDir = path.resolve('public/cdn');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function download(filename, url) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[EXISTS] ${filename}`);
      return resolve();
    }
    const fileStream = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          redirectRes.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            console.log(`[DOWNLOADED (redir)] ${filename}`);
            resolve();
          });
        });
        return;
      }
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`[DOWNLOADED] ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      console.error(`[ERROR] ${filename}:`, err.message);
      resolve();
    });
  });
}

async function run() {
  for (const [filename, url] of Object.entries(files)) {
    await download(filename, url);
  }
  console.log('All downloads completed!');
}

run();
