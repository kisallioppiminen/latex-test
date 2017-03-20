let button;

describe('Button class', function () {

  beforeEach(function () {
    button = new Button();
  });

  it('should find correct course ID from URL', function () {
    let id = button._getHTMLID('https://ohtukisalli.github.io/dev-frontend/kurssit/maa2/index.html');
    expect(id).toBe('maa2');
  });

  it('should return correct color IDs', function () {
    expect(button._getColorID('red')).toBe(0);
    expect(button._getColorID('yellow')).toBe(1);
    expect(button._getColorID('green')).toBe(2);
  });

  it('should extract correct course data', function () {
    let mockJSON = '[{"html_id":"may1","coursekey":"mock_key","id":3},{"html_id":"maa3","coursekey":"another_key","id":124}]';
    button._extractCourseData(JSON.parse(mockJSON), 'may1');
    expect(button.courseData.coursekey).toBe('mock_key');
    expect(button.courseData.course_id).toBe(3);
  });

});

describe('Button class', function () {

  beforeEach(function () {
    let tehtavaDiv = document.createElement('div');
    tehtavaDiv.setAttribute('class', 'tehtava');
    tehtavaDiv.setAttribute('id', '123');
    let header = document.createElement('header');
    header.setAttribute('id', 'header123');
    tehtavaDiv.appendChild(header);
    let innerDiv = document.createElement('div');
    tehtavaDiv.appendChild(innerDiv);
    view = new View();
    button = new Button();

    document.body.appendChild(tehtavaDiv);
  });

  it('should add button group to "tehtava" div', function () {
    button._addButtons();
    expect(document.getElementsByTagName('button').length).toBe(3);
  });

  it('text should change', function () {
    expect(document.getElementById('textbar_123').innerHTML).toBe('Miten tehtävä meni?');
    button._changeButtonTitleText('123', 'Hello, world!');
    expect(document.getElementById('textbar_123').innerHTML).toBe('Hello, world!');
  });

  it('should change header color', function () {
    button._changeProblemHeaderColor('0;123');
    let element = document.getElementById('header123');
    let style = window.getComputedStyle(element);
    expect(style.backgroundColor).toBe('rgb(217, 83, 79)');
  });

});
