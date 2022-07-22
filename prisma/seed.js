const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const categories = [
  {
    name: 'Maitotuotteet',
    imageUrl:
      'https://images.unsplash.com/photo-1454179083322-198bb4daae41?auto=format&fit=crop&w=640&q=80',
    items: [
      'AB jogurtti',
      'Juusto (vahva)',
      'Juustoviipaleet',
      'Kahvimaito (kaura)',
      'Kahvimaito',
      'Kaurajogurtti',
      'Kermavaahto',
      'Kevytmaito',
      'Soijajogurtti',
      'Täysmaito',
    ],
  },
  {
    name: 'Kuiva-aineet ja mausteet',
    imageUrl:
      'https://images.unsplash.com/photo-1627485937980-221c88ac04f9?auto=format&fit=crop&w=640&q=80',
    items: [
      'Hermesetas',
      'Hunaja',
      'Paprikajauhe',
      'Pippuri',
      'Ruisjauho',
      'Suola',
      'Tilli (kuivattu)',
      'Tilli (tuore)',
      'Timjami',
      'Vehnäjauho',
    ],
  },
  {
    name: 'Juomat',
    imageUrl:
      'https://images.unsplash.com/photo-1474314005122-3c07c4df1224?auto=format&fit=crop&w=640&q=80',
    items: [
      'Appelsiinimehu',
      'Kalja (alkoholiton)',
      'Kalja',
      'Mustikkamehu',
      'Omenamehu',
      'Siideri (alkoholiton)',
      'Siideri',
    ],
  },
  {
    name: 'Hedelmät ja vihannekset',
    imageUrl:
      'https://images.unsplash.com/photo-1573246123716-6b1782bfc499?auto=format&fit=crop&w=640&q=80',
    items: [
      'Appelsiini',
      'Kesäkurpitsa',
      'Kesäsipuli',
      'Kukkakaali',
      'Kurkku',
      'Mansikka',
      'Omena',
      'Parsakaali',
      'Peruna',
      'Salaatti',
      'Sipuli',
      'Tomaatti',
    ],
  },
  {
    name: 'Viljatuotteet',
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=640&q=80',
    items: ['Ruisleipä', 'Kauraleipä', 'Vehnäleipä', 'Näkkäri', 'Hapankorppu'],
  },
  {
    name: 'Pakasteet',
    imageUrl:
      'https://images.unsplash.com/photo-1625326155150-b0cdf9c6c9f7?auto=format&fit=crop&w=640&q=80',
    items: ['Pakastemansikka', 'Pakastemustikka', 'Pakastevadelma', 'Jäätelö'],
  },
  {
    name: 'Liha ja merenelävät',
    imageUrl:
      'https://images.unsplash.com/photo-1589372545389-bb4d9d138bdb?auto=format&fit=crop&w=640&q=80',
    items: [
      'Graavilohi',
      'Kanafile',
      'Kananmuna',
      'Kylmäsavustettu lohi',
      'Nautafile',
      'Possufile',
      'Sinappisilli',
      'Sipulisilli',
    ],
  },
  {
    name: 'Herkut, kahvit ja tee',
    imageUrl:
      'https://images.unsplash.com/photo-1422207199074-a7cbd3fd1ae5?auto=format&fit=crop&w=640&q=80',
    items: [
      'Hedelmäkarkki',
      'Kahvi',
      'Lakritsi',
      'Salmiakki',
      'Suklaa',
      'Suklaakeksi',
      'Tee',
    ],
  },
  {
    name: 'Säilykkeet',
    imageUrl:
      'https://images.unsplash.com/photo-1619995746608-bef3de4f075a?auto=format&fit=crop&w=640&q=80',
    items: ['Tonnikala', 'Aurinkokuivatettu tomaatti'],
  },
  {
    name: 'Öljyt ja kastikkeet',
    imageUrl:
      'https://images.unsplash.com/photo-1631325026013-16eb55059579?auto=format&fit=crop&w=640&q=80',
    items: [
      'Ketsuppi',
      'Oliiviöljy',
      'Rypsiöljy',
      'Salaatinkastike',
      'Sinappi',
      'Vaniljakastike',
    ],
  },
  {
    name: 'Paperit ja tarvikkeet',
    imageUrl:
      'https://images.unsplash.com/photo-1605043146034-c4ee2dbc0fba?auto=format&fit=crop&w=640&q=80',
    items: [
      'Vessapaperi',
      'Talouspaperi',
      'Suodatinpaperi',
      'Kertakäyttölautaset',
    ],
  },
];

async function seed() {
  const projects = await prisma.project.findMany();

  if (projects.length === 0) {
    const hashedPin = await bcrypt.hash('123456', 10);

    const project = await prisma.project.create({
      data: {
        name: 'Hattusaari',
        pin: hashedPin,
        categories: {
          create: categories.map((category) => ({
            name: category.name,
            imageUrl: category.imageUrl,
            items: {
              create: category.items.map((item) => ({
                name: item,
              })),
            },
          })),
        },
      },
    });

    console.log('Created project', project.name);
    console.log(`Database has been seeded. 🌱`);
  } else {
    console.log('Database has already been seeded');
  }
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
