DROP TABLE IF EXISTS workouts;
CREATE TABLE workouts(
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  reps INT,
  weight INT,
  date DATE,
  lbs BOOLEAN);
INSERT INTO workouts (name,reps,weight,date,lbs) VALUES ('romanian deadlifts',3,52,'2016-01-01',0);
INSERT INTO workouts (name,reps,weight,date,lbs) VALUES ('squats',2,100,'2016-02-01',1);
