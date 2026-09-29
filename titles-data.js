/* Samdo FC — Nubri Manaslu Cup titles.
   To add a title: copy one block, change the year, opponent, score and squad.
   squad: null  -> shows "We're working on it" (use it for a year whose photos aren't ready yet).
   Photos live in images/web/squads/<year>/ (small web copies of "Champion Year Squad"). */
(() => {
  const CLUBS = {
    samdo: { name: 'Samdo FC', logo: 'images/web/crest.png' },
    shala: { logo: 'images/web/clubs/shylafc.jpg' },  // Shala A and Shala B share one logo
    sama:  { logo: 'images/web/clubs/samafc.jpg' }    // Sama A and Sama B share one logo
  };
  const p = (year, file, name, role) => ({ name, role: role || '', image: `images/web/squads/${year}/${file}.jpg` });

  window.SAMDO_TITLES = [
    {
      year: '2016', title: 'First title',
      opponent: null, score: null,
      note: 'Where it all began: the first Nubri Manaslu Cup won by Samdo FC.',
      squad: [
        p(2016, 'a-karma', 'A Karma'),
        p(2016, 'babu', 'Babu'),
        p(2016, 'chemi-dorjee', 'Chemi Dorjee'),
        p(2016, 'choedhak', 'Choedhak'),
        p(2016, 'lhakpa', 'Lhakpa'),
        p(2016, 'malor-10', 'Malor'),
        p(2016, 'nyimadorjee', 'Nyima Dorjee'),
        p(2016, 'orgen', 'Orgen'),
        p(2016, 'rinzing', 'Rinzing'),
        p(2016, 'tashitsering', 'Tashi Tsering'),
        p(2016, 'tsering-wangdue', 'Tsering Wangdue'),
        p(2016, 'tseringdhargyal', 'Tsering Dhargyal')
      ]
    },
    {
      year: '2022', title: 'Second title',
      opponent: { name: 'Shala A', ...CLUBS.shala }, score: '2–1',
      note: 'Samdo FC beat Shala A 2–1 in the final.',
      squad: [
        p(2022, 'dawasangpo-1', 'Dawa Sangpo', 'Goalkeeper'),
        p(2022, 'dawa-dhundup', 'Dawa Dhundup'),
        p(2022, 'lhakpa', 'Lhakpa'),
        p(2022, 'malor-10', 'Malor'),
        p(2022, 'orgen', 'Orgen'),
        p(2022, 'pasangchoemple', 'Pasang Choemple'),
        p(2022, 'pasanglambu', 'Pasang Lambu'),
        p(2022, 'pembatsering-6', 'Pemba Tsering'),
        p(2022, 'rinzing', 'Rinzing'),
        p(2022, 'sonam-8', 'Sonam'),
        p(2022, 'tashigaaba', 'Tashi Gaaba'),
        p(2022, 'tseringdhargyal', 'Tsering Dhargyal'),
        p(2022, 'wangchuk-7', 'Wangchuk'),
        p(2022, 'yeshi', 'Yeshi')
      ]
    },
    {
      year: '2023', title: 'Third title',
      opponent: { name: 'Shala B', ...CLUBS.shala }, score: '3–0',
      note: 'Samdo FC beat Shala B 3–0 in the final.',
      squad: [
        p(2023, 'dawasangpo-1', 'Dawa Sangpo', 'Goalkeeper'),
        p(2023, 'dawa-12', 'Dawa'),
        p(2023, 'lhakpa', 'Lhakpa'),
        p(2023, 'malor-10', 'Malor'),
        p(2023, 'pembatsering-6', 'Pemba Tsering'),
        p(2023, 'tashigaaba', 'Tashi Gaaba'),
        p(2023, 'tashiphuntsok-23', 'Tashi Phuntsok'),
        p(2023, 'tenzin', 'Tenzin'),
        p(2023, 'tharpa-9', 'Tharpa'),
        p(2023, 'choegyal', 'Choegyal'),
        p(2023, 'orgen', 'Orgen'),
        p(2023, 'pasangchoemple', 'Pasang Choemple'),
        p(2023, 'pasanglambu', 'Pasang Lambu'),
        p(2023, 'tseringdhargyal', 'Tsering Dhargyal'),
        p(2023, 'tashitsering-coach', 'Tashi Tsering', 'Coach')
      ]
    },
    {
      year: '2024', title: 'Fourth title',
      opponent: { name: 'Sama A', ...CLUBS.sama }, score: '1–0',
      note: 'Samdo FC beat Sama A 1–0 in the final.',
      squad: [
        p(2024, 'dawasangpo-1', 'Dawa Sangpo', 'Goalkeeper'),
        p(2024, 'choedhak-11', 'Choedhak'),
        p(2024, 'lhakpa', 'Lhakpa'),
        p(2024, 'malor-10', 'Malor'),
        p(2024, 'pembatsering-6', 'Pemba Tsering'),
        p(2024, 'rinzing', 'Rinzing'),
        p(2024, 'sonam-8', 'Sonam'),
        p(2024, 'tashigaaba', 'Tashi Gaaba'),
        p(2024, 'tashiphuntsok-23', 'Tashi Phuntsok'),
        p(2024, 'tharpa-9', 'Tharpa'),
        p(2024, 'choegyal', 'Choegyal'),
        p(2024, 'dawacr', 'Dawa CR'),
        p(2024, 'pasangchoemple', 'Pasang Choemple'),
        p(2024, 'tseringdhargyal', 'Tsering Dhargyal')
      ]
    },
    {
      year: '2026', title: 'Fifth title',
      opponent: { name: 'Sama A', ...CLUBS.sama }, score: '2–1',
      note: 'Samdo FC beat Sama A 2–1 in the final. Wangchuk and Tashi scored in the second half.',
      squad: 'current'   // uses this year's squad from squad-data.js
    }
  ];
  window.SAMDO_CLUBS = CLUBS;
})();
