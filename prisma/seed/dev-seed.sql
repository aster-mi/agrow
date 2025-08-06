BEGIN;

DO $$
DECLARE
  v_user_id text;
BEGIN
  -- 0) 最初のユーザー
  SELECT id INTO v_user_id FROM "User" ORDER BY created_at ASC LIMIT 1;
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'no user found'; END IF;

  -- 1) Tag（name UNIQUE）
  INSERT INTO "Tag"(name) VALUES
    ('Agave tequilana'),
    ('Agave americana'),
    ('Agave victoriae-reginae'),
    ('Agave parryi'),
    ('Agave attenuata')
  ON CONFLICT (name) DO NOTHING;

  -- 2) Agave（updatedAt NOT NULL のため両方明示）
  WITH to_ins AS (
    SELECT * FROM (VALUES
      ('agave-tequilana',        'Agave tequilana',        'テキーラ原料として知られるブルーアガベ'),
      ('agave-americana',        'Agave americana',        'リュウゼツランとして一般に知られる大型種'),
      ('agave-victoriae-reginae','Agave victoriae-reginae','女王アガベ。コンパクトで幾何学模様の葉'),
      ('agave-parryi',           'Agave parryi',           '耐寒性が比較的高い美しいロゼット'),
      ('agave-attenuata',        'Agave attenuata',        '鋭い棘が少なく扱いやすいソフトアガベ')
    ) AS t(slug,name,description)
  )
  INSERT INTO "Agave"(slug, name, description, "ownerId", "createdAt", "updatedAt")
  SELECT slug, name, description, v_user_id, NOW(), NOW() FROM to_ins
  ON CONFLICT (slug) DO NOTHING;

  -- 3) 5件の Agave id 取得
  CREATE TEMP TABLE _agave_ids ON COMMIT DROP AS
  SELECT id, slug, ROW_NUMBER() OVER (ORDER BY id) AS rn
  FROM "Agave"
  WHERE slug IN (
    'agave-tequilana', 'agave-americana', 'agave-victoriae-reginae', 'agave-parryi', 'agave-attenuata'
  )
  ORDER BY id;

  -- 4) AgaveImage（url UNIQUE）
  INSERT INTO "AgaveImage"(url, "agaveId", "shotDate", "ownerId")
  SELECT 'agave/noimage.jpg', id, NOW() - INTERVAL '3 days', v_user_id FROM _agave_ids
  ON CONFLICT (url) DO NOTHING;

  INSERT INTO "AgaveImage"(url, "agaveId", "shotDate", "ownerId")
  SELECT 'agave/dotAgave.png', id, NOW() - INTERVAL '2 days', v_user_id FROM _agave_ids
  ON CONFLICT (url) DO NOTHING;

  INSERT INTO "AgaveImage"(url, "agaveId", "shotDate", "ownerId")
  SELECT 'agave/dotPup.png',  id, NOW() - INTERVAL '1 days', v_user_id FROM _agave_ids
  ON CONFLICT (url) DO NOTHING;

  -- 5) Post 5件（createdAt/updatedAt を明示）
  INSERT INTO "Post"(content, "authorId", "createdAt", "updatedAt") VALUES
    ('本日の管理記録：水やり少量。日照は午前のみ。', v_user_id, NOW(), NOW()),
    ('追記：葉色が良くなってきた。',                           v_user_id, NOW(), NOW()),
    ('用土配合を変更（赤玉土多めに）。',                       v_user_id, NOW(), NOW()),
    ('追記：根張りは問題なし。',                               v_user_id, NOW(), NOW()),
    ('来週に植え替え予定。',                                   v_user_id, NOW(), NOW());

  -- 親子関係（2→1, 4→3）
  WITH p AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt", id) rn
    FROM "Post" WHERE "authorId" = v_user_id
  )
  UPDATE "Post" SET "parentId" = p1.id FROM p p2 JOIN p p1 ON p2.rn=2 AND p1.rn=1 WHERE "Post".id = p2.id;

  WITH p AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt", id) rn
    FROM "Post" WHERE "authorId" = v_user_id
  )
  UPDATE "Post" SET "parentId" = p3.id FROM p p4 JOIN p p3 ON p4.rn=4 AND p3.rn=3 WHERE "Post".id = p4.id;

  -- 6) PostsOnAgaveImages（先頭5件）
  CREATE TEMP TABLE _post_ids ON COMMIT DROP AS
  SELECT id, ROW_NUMBER() OVER (ORDER BY "createdAt", id) rn
  FROM "Post" WHERE "authorId" = v_user_id LIMIT 5;

  CREATE TEMP TABLE _img_ids ON COMMIT DROP AS
  SELECT id, ROW_NUMBER() OVER (ORDER BY id) rn
  FROM "AgaveImage" WHERE "ownerId" = v_user_id LIMIT 5;

  INSERT INTO "PostsOnAgaveImages"("postId", "agaveImageId")
  SELECT p.id, i.id FROM _post_ids p JOIN _img_ids i ON p.rn = i.rn
  ON CONFLICT DO NOTHING;

  -- 7) Like（各ポスト2件）
  INSERT INTO "Like"("postId", "userId")
  SELECT p.id, v_user_id FROM _post_ids p, generate_series(1,2)
  ON CONFLICT DO NOTHING;

  -- 8) TagsOnAgaves（Tag ⇄ Agave をRRで）
  WITH tag_ids AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) rn FROM "Tag" WHERE name IN (
      'Agave tequilana', 'Agave americana', 'Agave victoriae-reginae', 'Agave parryi', 'Agave attenuata'
    )
  )
  INSERT INTO "TagsOnAgaves"("agaveId", "tagId")
  SELECT a.id, (SELECT id FROM tag_ids WHERE rn = ((a.rn-1) % 5) + 1)
  FROM _agave_ids a
  ON CONFLICT DO NOTHING;
END $$;

COMMIT;
