describe('Exercises class', function () {

  it('should extract exercises from HTML page correctly', function() {
    let mockHTML = '<input type="hidden" id="chapterNumber" value="1">' +
                    '<div class="tehtava" id="abc">' +
                    '<div class="tehtava" id="def">' +
                    '<div class="tehtava" id="ghi">' +
                    '<div class="tehtava" id="jkl">' +
                    '<input type="hidden" id="chapterNumber" value="2">' +
                    '<div class="tehtava" id="mno">' +
                    '<div class="tehtava" id="pqr">' +
                    '<div class="tehtava" id="stu">' +
                    '<div class="tehtava" id="vwx">';

    let exercises = Exercises.extractExercises(mockHTML);
    expect(exercises[0].number).toBe('1.1');
    expect(exercises[0].id).toBe('abc');

    expect(exercises[1].number).toBe('1.2');
    expect(exercises[1].id).toBe('def');

    expect(exercises[3].number).toBe('1.4');
    expect(exercises[3].id).toBe('jkl');

    expect(exercises[4].number).toBe('2.1');
    expect(exercises[4].id).toBe('mno');

    expect(exercises[6].number).toBe('2.3');
    expect(exercises[6].id).toBe('stu');

    expect(exercises[8]).toBeUndefined();
    expect(exercises[145]).toBeUndefined();
  });

});