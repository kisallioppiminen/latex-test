# Student application Kisallioppiminen.fi with marking system

View courses with marking system on [kisallioppiminen v2 beta](https://ohtukisalli.github.io/).


## Setting up Kisallioppiminen.fi site locally with Jekyll

Go to project folder and execute the following commands
```bash
gem install bundler
bundle install
```

To serve Jekyll site locally, execute
```bash
bundle exec jekyll serve
```

Your local Kisallioppiminen.fi site is now live at `http://localhost:4000`

To use Jekyll with local backend, execute
```bash
JEKYLL_ENV=local bundle exec jekyll serve
```
To run tests, execute
```bash
bundle exec rspec
```

You can use Front Matter's site variable `site.backendbaseurl` and javascript global variable `BACKEND_BASE_URL`. Both will point to `http://localhost:3000/`, which is the default location of local backend.

More detailed instructions can be found [here](https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/).
