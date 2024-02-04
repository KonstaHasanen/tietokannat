//tehtävä 1
db.kaupungit.find();
db.kaupungit.findOne();

//tehtävä 2
db.kaupungit.find({ maa: 'Espanja' }, { _id: 0, seurat: 0 });

//tehtävä 3
db.kaupungit.find(
  { maa: 'Suomi', asukasluku: { $lte: 135 } },
  { _id: 0, nimi: 1, asukasluku: 1 }
);

//tehtävä 4
db.kaupungit.find({
  $and: [
    { maa: 'Suomi' },
    { asukasluku: { $gte: 150 } },
    { asukasluku: { $lte: 200 } },
  ],
});

//tehtävä 5
db.kaupungit.find({
  $and: [
    { maa: 'Suomi' },
    { $or: [{ asukasluku: { $lte: 100 } }, { asukasluku: { $gte: 200 } }] },
  ],
});

//tehtävä 6

db.kaupungit.find({
  $and: [
    { maa: 'Suomi' },
    {
      $or: [{ asukasluku: { $lte: 50 } }, { 'seurat.sarja': 'Veikkausliiga' }],
    },
  ],
});

//tehtävä 7

db.kaupungit.find({
  $and: [{ maa: 'Suomi' }, { perustettu: { $exists: true } }],
});

//tehtävä 8

db.kaupungit.find({ 'seurat.nimi': { $regex: 'FC' } });

//tehtävä 9

db.kaupungit
  .find({}, { _id: 0, nimi: 1, asukasluku: 1 })
  .sort({ asukasluku: -1 })
  .limit(3)
  .skip(1);

//tehtävä 10

db.kaupungit.find({ maa: 'Suomi' }).count();

//Levykanta

//kysely1

db.yhtyeet.find({ 'levy.nimi': 'Koodinvaantaja' });

//kysely 2

db.kayttaja.find({}, { _id: 0, ktun: 1, nimi: 1 });

//kysely 3

db.yhtyeet.find({ 'levy.julkaisuvuosi': '2019' });

//IKK-kanta

//k1

db.projekti.find();

//k2

db.projekti.find().sort({ nimi: 1 });

//k3

db.projekti.find({ katsottu: { $gt: 100 } });

//k4

db.projekti.updateMany({}, { $inc: { katsottu: 1 } });

//k5

db.projekti.find({
  $and: [{ katsottu: { $gt: 100 } }, { ladattu: { $lte: 20 } }],
});

//k6

db.projekti.find({
  $or: [{ katsottu: { $lte: 60 } }, { katsottu: { $gte: 120 } }],
});

//k7

db.projekti.find({ 'projektiryhma.rooli': { $in: ['testaus'] } });

//ylläpitoa futis-kantaan

//1

db.kaupungit.updateOne({ nimi: 'Varkaus' }, { $set: { asukasluku: 22 } });

//2

db.kaupungit.updateOne({ nimi: 'Varkaus' }, { $set: { perustettu: 1929 } });

//3

db.kaupungit.updateMany({ maa: 'Suomi' }, { $inc: { asukasluku: 2 } });

//4

db.kaupungit.updateMany(
  { $and: [{ maa: 'Suomi' }, { nähtävyydet: { $exists: true } }] },
  { $push: { nähtävyydet: 'Tuomiokirkko' } }
);

db.kaupungit.updateOne({ nimi: 'Nurmes' }, { $pop: { nähtävyydet: 1 } });

//5

db.kaupungit.find({ nähtävyydet: 'Tuomiokirkko' });

//6

db.kaupungit.insertOne({
  maa: 'suomi',
  nimi: 'Nurmes',
  asukasluku: 10,
  perustettu: 1973,
  nähtävyydet: ['Bomba', 'Tuomiokirkko'],
});

//7

db.kaupungit.updateOne(
  { nimi: 'Nurmes' },
  { $pop: { nähtävyydet: 1 } },
  { $push: { nähtävyydet: 'Vanha Kauppala' } }
);

db.kaupungit.updateOne(
  { nimi: 'Nurmes' },
  { $push: { nähtävyydet: 'Vanha Kauppala' } }
);

//8

db.kaupungit.deleteOne({ nimi: 'Nurmes' });

//9

db.kaupungit.drop();

//10

db.dropDatabase();

db.kayttaja.updateOne(
  { rattijuopumukset: { $exists: true } },
  { $inc: { rattijuopumukset: 3 } }
);

//tentti

db.ilmot.insertOne({
  nimi: 'Oma testi',
  lisatietoja: 'Ensimmäinen insert',
  julkaistu: false,
});

db.ilmot.updateOne(
  { nimi: 'Tietokannat 1, Mongotentti' },
  {
    $push: {
      ilmoittautuneet: {
        nimi: 'Konsta Hasanen',
        sposti: 'ab8070@student.jamk.fi',
      },
    },
  }
);

db.ilmot.updateOne(
  { nimi: 'Tietokannat 1, uusintatentti' },
  { $set: { julkaistu: true } }
);

db.ilmot.updateMany({ maksimi: { $exists: true } }, { $inc: { maksimi: 10 } });

db.ilmot.deleteMany({ julkaistu: false });

db.ilmot.find({ nimi: 'Jouluaatto' });

db.ilmot.find(
  { 'paikka.postitoimipaikka': 'Jyväskylä' },
  { _id: 0, nimi: 1, paikka: 1 }
);

db.ilmot.find(
  { $and: [{ maksimi: { $exists: true } }, { maksimi: { $lte: 50 } }] },
  { _id: 0, nimi: 1, maksimi: 1 }
);

db.ilmot
  .find(
    { $and: [{ maksimi: { $exists: true } }, { maksimi: { $lte: 50 } }] },
    { _id: 0, nimi: 1, maksimi: 1 }
  )
  .limit(2);

db.ilmot.find(
  { 'ilmoittautuneet.nimi': 'Sanna Savikkomaa' },
  { _id: 0, nimi: 1, alkuaika: 1 }
);

db.ilmot.find(
  {
    $and: [
      { 'paikka.postitoimipaikka': 'Jyväskylä' },
      {
        $or: [{ maksimi: { $lte: 25 } }, { maksimi: { $gte: 45 } }],
      },
    ],
  },
  { _id: 0, nimi: 1, 'paikka.postitoimipaikka': 1, maksimi: 1 }
);

db.ilmot.find(
  {
    $or: [
      { 'ilmoittautuneet.nimi': 'Ilona Issakainen' },
      { 'yhteys.nimi': 'Ilona Issakainen' },
    ],
  },
  { _id: 0, nimi: 1, alkuaika: 1, paikka: 1 }
);
