-- Create database if not exists
CREATE DATABASE IF NOT EXISTS pickchef CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE pickchef;

-- Insert some sample ingredients
INSERT INTO ingredients (name, category, unit) VALUES
('양파', '채소', '개'),
('당근', '채소', '개'),
('감자', '채소', '개'),
('대파', '채소', '뿌리'),
('마늘', '채소', '쪽'),
('생강', '향신료', 'g'),
('소금', '조미료', 'g'),
('후춧가루', '향신료', 'g'),
('식용유', '기름', 'ml'),
('간장', '조미료', 'ml'),
('설탕', '조미료', 'g'),
('계란', '단백질', '개'),
('쌀', '곡물', 'g'),
('닭고기', '단백질', 'g'),
('돼지고기', '단백질', 'g')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert some sample recipes
INSERT INTO recipes (title, description, instructions, cooking_time, difficulty, servings, image_url) VALUES
('김치볶음밥', '간단하고 맛있는 김치볶음밥', '1. 팬에 기름을 두르고 김치를 볶는다.\n2. 밥을 넣고 함께 볶는다.\n3. 간장과 설탕으로 간을 맞춘다.\n4. 계란을 풀어서 넣고 마저 볶는다.', 15, 'easy', 2, 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg'),
('계란후라이', '기본적인 계란후라이 만들기', '1. 팬에 기름을 두른다.\n2. 계란을 깨서 팬에 넣는다.\n3. 소금과 후춧가루로 간을 한다.\n4. 적당히 익으면 완성.', 5, 'easy', 1, 'https://images.pexels.com/photos/824635/pexels-photo-824635.jpeg'),
('볶음밥', '맛있는 볶음밥 레시피', '1. 팬에 기름을 두르고 마늘을 볶는다.\n2. 밥을 넣고 볶는다.\n3. 간장으로 간을 맞춘다.\n4. 대파를 넣고 마저 볶는다.', 10, 'easy', 2, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg')
ON DUPLICATE KEY UPDATE title=VALUES(title);