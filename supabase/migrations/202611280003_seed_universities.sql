insert into public.universities (code, name, city, status)
values
  ('UNI-001', 'Bandırma Onyedi Eylül University', 'Bandırma', 'active'),
  ('UNI-002', 'Ankara Yıldırım Beyazıt University', 'Ankara', 'active'),
  ('UNI-003', 'Sakarya University', 'Sakarya', 'active'),
  ('UNI-004', 'Necmettin Erbakan University', 'Konya', 'active'),
  ('UNI-005', 'Kırklareli University', 'Kırklareli', 'active'),
  ('UNI-006', 'Erciyes University', 'Kayseri', 'active'),
  ('UNI-007', 'Bartın University', 'Bartın', 'active'),
  ('UNI-008', 'Kütahya Dumlupınar University', 'Kütahya', 'active'),
  ('UNI-009', 'Afyon Kocatepe University', 'Afyonkarahisar', 'active'),
  ('UNI-010', 'Hitit University', 'Çorum', 'active'),
  ('UNI-011', 'Çanakkale Onsekiz Mart University', 'Çanakkale', 'active'),
  ('UNI-012', 'Süleyman Demirel University', 'Isparta', 'active'),
  ('UNI-013', 'Sivas Cumhuriyet University', 'Sivas', 'active'),
  ('UNI-014', 'Bolu Abant İzzet Baysal University', 'Bolu', 'active'),
  ('UNI-015', 'Anadolu University', 'Eskişehir', 'active'),
  ('UNI-016', 'Gaziantep University', 'Gaziantep', 'active'),
  ('UNI-017', 'Karabük University', 'Karabük', 'active'),
  ('UNI-018', 'Kastamonu University', 'Kastamonu', 'active'),
  ('UNI-019', 'Zonguldak Bülent Ecevit University', 'Zonguldak', 'active'),
  ('UNI-020', 'Karadeniz Technical University', 'Trabzon', 'active'),
  ('UNI-021', 'Balıkesir University', 'Balıkesir', 'active'),
  ('UNI-022', 'Bursa Uludağ University', 'Bursa', 'active'),
  ('UNI-023', 'Bursa Technical University', 'Bursa', 'active'),
  ('UNI-024', 'İstanbul Medipol University', 'Istanbul', 'active'),
  ('UNI-025', 'Lokman Hekim University', 'Ankara', 'active'),
  ('UNI-026', 'Bahçeşehir University', 'Istanbul', 'active'),
  ('UNI-027', 'Üsküdar University', 'Istanbul', 'active'),
  ('UNI-028', 'İstanbul Sabahattin Zaim University', 'Istanbul', 'active')
on conflict (code) do update
set name = excluded.name,
    city = excluded.city,
    status = excluded.status,
    updated_at = now();

notify pgrst, 'reload schema';
