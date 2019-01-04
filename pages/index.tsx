import { Layout } from '../components/layout';

export default () =>
  <Layout>
    <section className="content" id="aboutme">
      <h1>About me</h1>

      <article className="media">
        <figure className="media-left" id="avatar-container">
          <p className="image is-100x100" id="avatar">
            <img src="http://www.gravatar.com/avatar/0d2a86f4099d096a4a6a9d1eb977bf38?s=100" />
          </p>
        </figure>

        <div className="media-content">
          <div className="content">
            <p>
              <strong>Daisuke Mruase</strong> <small>a.k.a</small> <strong>typester</strong>
            </p>
            <p>Software engineer, lives in Kamakura Japan.</p>

            <div id="links">
              <ul className="is-hidden-mobile">
                <li><a href="https://github.com/typester">https://github.com/typester</a></li>
                <li><a href="https://metacpan.org/author/TYPESTER">https://metacpan.org/author/TYPESTER</a></li>
                <li><a href="http://www.flickr.com/photos/typester/">http://www.flickr.com/photos/typester/</a></li>
                <li><a href="https://twitter.com/typester">https://twitter.com/typester</a></li>
                <li><a href="https://www.facebook.com/typester">https://www.facebook.com/typester</a></li>
              </ul>

              <p className="is-hidden-tablet" id="links-mobile">
                <a href="https://github.com/typester">
                  <span className="icon is-medium"><i className ="fab fa-2x fa-github"></i></span>
                </a>
                <a href="https://twitter.com/typester">
                  <span className="icon is-medium"><i className ="fab fa-2x fa-twitter"></i></span>
                </a>
                <a href="http://www.flickr.com/photos/typester/">
                  <span className="icon is-medium"><i className ="fab fa-2x fa-flickr"></i></span>
                </a>
                <a href="https://facebook.com/typester">
                  <span className="icon is-medium"><i className ="fab fa-2x fa-facebook"></i></span>
                </a>
                <a href="https://www.instagram.com/typester">
                  <span className="icon is-medium"><i className ="fab fa-2x fa-instagram"></i></span>
                </a>
              </p>
            </div>

          </div>
        </div>
      </article>
    </section>
  </Layout>;
