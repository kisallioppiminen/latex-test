class Exercises {

  static extractExercises(pageData) {
    const regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    let regex_array = regex.exec(pageData);

    let exercises = [];
    let chapterNumber = 0;
    let exerciseCounter = 1;

    while (regex_array != null) {
      if (regex_array[1] == null) {
        exercises.push({
          id: regex_array[2],
          number: `${chapterNumber}.${exerciseCounter}`
        });
        exerciseCounter++;
      } else if (regex_array[2] == null) {
        chapterNumber = regex_array[1];
        exerciseCounter = 1;
      }
      regex_array = regex.exec(pageData);
    }
    return exercises;
  }

}
