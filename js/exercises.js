class Exercises {

  /**
   * Generates an array with exercises and their corresponding IDs.
   * @param  {String} pageData Raw print.html data
   * @return {Array}          Array of exercises
   */
  static extractExercises(pageData) {
    // Matches chapter number OR exercise ID
    const regex = /(?:id="chapterNumber" value="([0-9])")|(?:<div\s+class="tehtava"\s+id="([a-zA-Z0-9ÅåÄäÖö.;:_-]+)">)/g;
    let regex_array = regex.exec(pageData);

    // Initialize variables
    let exercises = [];
    let chapterNumber = 0;
    let exerciseCounter = 1;

    // While matches are found
    while (regex_array != null) {
      // If matches a chapter number
      if (regex_array[1] == null) {
        exercises.push({
          id: regex_array[2],
          number: `${chapterNumber}.${exerciseCounter}`
        });
        exerciseCounter++;
      // If matches an exercise ID  
      } else if (regex_array[2] == null) {
        chapterNumber = regex_array[1];
        exerciseCounter = 1;
      }
      regex_array = regex.exec(pageData);
    }
    return exercises;
  }

}
