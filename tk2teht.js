//Th1
db.opiskelijat.update({ _id: 'a123' }, { $set: { sukunimi: 'Pennanen' } });
db.arvioinnit.find({ opnro: 'b234' });
db.arvioinnit.updateOne(
  { opnro: 'b234', koodi: 'FPER' },
  { $push: { suor: { tyyppi: 'lisatehtavat', arv: 1 } } }
);
db.arvioinnit.find(
  { koodi: 'FPER', 'suor.tyyppi': 'lisatehtavat' },
  { _id: 0, opnro: 1 }
);

//Th2
db.lemmikit.countDocuments({});
db.lemmikit.findOne({ nimi: 'Harppu' });
db.lemmikit.find(
  { 'omistaja.kunta': 'Hankasalmi' },
  { _id: 0, nimi: 1, omistaja: 1 }
);
db.lemmikit.find({
  $and: [
    { 'rokotukset.nimi': 'Penikkatauti' },
    {
      $or: [{ 'kasvattaja.kunta': 'Laukaa' }, { 'kasvattaja.kunta': 'Liperi' }],
    },
  ],
});
db.lemmikit.updateMany(
  { laakarikaynnit: { $exists: 1 } },
  { $inc: { laakarikaynnit: 1 } }
);

//Th3

//Hae kuinka monta yksilöä kutakin lemmikkilajia lemmmikit-collectionissa on

db.lemmikit.aggregate([{ $group: { _id: '$laji', maara: { $sum: 1 } } }]);

//Lisää $project-vaihe, jonka jälkeen lajitieto näkyy avaimessa "laji" ja _id-avainta ei näytetä lainkaan.

db.lemmikit.aggregate([
  { $group: { _id: '$laji', maara: { $sum: 1 } } },
  { $project: { _id: 0, laji: '$_id', maara: 1 } },
]);

//Nimeä maara-sarake $project-vaiheessa nimelle lkm (älä siis muuta $group-vaiheen koodia, vaan hoida asia $project-vaiheessa

db.lemmikit.aggregate([
  { $group: { _id: '$laji', maara: { $sum: 1 } } },
  { $project: { _id: 0, laji: '$_id', lkm: '$maara' } },
]);

//th4

//Listaa lemmikkien määrät kasvattajan kotikunnan mukaisesti.

db.lemmikit.aggregate([
  {
    $group: {
      _id: '$kasvattaja.kunta',
      lkm: {
        $sum: 1,
      },
    },
  },
]);

//Lajittele tulosjoukko ensisijaisesti lukumäärän mukaan laskevaan järjestykseen ja toissijaisesti kunnan mukaan nousevaan järjestykseen.

db.lemmikit.aggregate([
  {
    $group: {
      _id: '$kasvattaja.kunta',
      lkm: { $sum: 1 },
    },
  },
  {
    $sort: {
      lkm: -1,
      _id: 1,
    },
  },
]);

//Näytä tulosjoukosta sijoilla 3-5 olevat kunnat.

db.lemmikit.aggregate([
  {
    $group: {
      _id: '$kasvattaja.kunta',
      lkm: { $sum: 1 },
    },
  },
  {
    $sort: {
      lkm: -1,
      _id: 1,
    },
  },
  { $skip: 2 },
  { $limit: 3 },
]);

//th5

//Hae lemmikkien saamat rokotusannosten yhteissummat rokotteittain

db.lemmikit.aggregate([
  { $unwind: '$rokotukset' },
  {
    $group: {
      _id: '$rokotukset.nimi',
      yhteensa: {
        $sum: '$rokotukset.annoskoko',
      },
    },
  },
]);

//Näytä vain rokotteet, joita on annettu vähintään 500 yksikköä.

db.lemmikit.aggregate([
  { $unwind: '$rokotukset' },
  {
    $group: {
      _id: '$rokotukset.nimi',
      yhteensa: {
        $sum: '$rokotukset.annoskoko',
      },
    },
  },
  {
    $match: {
      yhteensa: { $gte: 500 },
    },
  },
]);

//Nimeä edellisen _id-sarake nimelle "rokote" ja muunna rokotteen nimi suuraakkosille.

db.lemmikit.aggregate([
  { $unwind: '$rokotukset' },
  {
    $group: {
      _id: '$rokotukset.nimi',
      yhteensa: {
        $sum: '$rokotukset.annoskoko',
      },
    },
  },
  {
    $match: {
      yhteensa: { $gte: 500 },
    },
  },
  { $project: { _id: 0, rokote: { $toUpper: '$_id' }, yhteensa: 1 } },
]);

//th6

//Lemmikit collectionin indeksit

db.lemmikit.getIndexes();
//output
[{ v: 2, key: { _id: 1 }, name: '_id_' }];

//Kaikki tiedot dokumenteista, joissa kasvattajan kunta on Toivakka

db.lemmikit.find({ 'kasvattaja.kunta': 'Toivakka' }).explain(true);
//Ei pystynyt hyödyntämään mitään indexiä, totalDocsExamined: 9

//Haun suoritusta tehostava indeksi

db.lemmikit.createIndex({ 'kasvattaja.kunta': 1 });
//totalDocsExamined: 2, totalKeysExamined: 2, pystyy hyödyntämään indeksejä

//th7

//Muokkaa hakuasi siten, että tulosjoukosta palautetaan vain lemmikin nimi ja kasvattajan kotikunta

db.lemmikit
  .find(
    { 'kasvattaja.kunta': 'Toivakka' },
    { _id: 0, nimi: 1, 'kasvattaja.kunta': 1 }
  )
  .explain(true);

//Luodaan compound indeksi

db.lemmikit.createIndex({ 'kasvattaja.kunta': 1, nimi: 1 });




db.posts.aggregate([
  {$group: {_id: "$author", views: {$sum: "$stats.views"}}},
  {$lookup: {from: "authors", localField: "_id", foreignField: "_id", as: "author"}},
  {$project: {_id: 0, kirjoittaja:"$author_info.name" , views: 1}},
  {$sort: {views: -1}}
])

db.posts.aggregate([
  { $group: { _id: "$author", views: { $sum: "$stats.views" } } },
  { $match: { views: { $gte: 1 } } },
  { $lookup: { from: "authors", localField: "_id", foreignField: "username", as: "author_info" } },
  { $unwind: "$author_info" },
  { $project: { _id: 0, nimi: "$author_info.name", katseluja: "$views" } },
  { $sort: { katseluja: -1 } }
])



db.posts.aggregate([
  { $unwind: "$comments" },
  { $group: { _id: "$comments.name", count: { $sum: 1 } } },
  { $match: { count: { $gte: 3 } } },
  { $project: { _id: 0, nimi: "$_id", lkm: "$count" } },
  { $sort: { lkm: -1 } }
])


db.posts.aggregate([
  {
    $lookup: {
      from: "authors",
      localField: "author",
      foreignField: "_id",
      as: "author"
    }
  },
  {
    $unwind: "$author"
  },
  {
    $project: {
      _id: 0,
      otsikko: "$title",
      teksti: "$body",
      nimi: "$author.name"
    }
  }
])

