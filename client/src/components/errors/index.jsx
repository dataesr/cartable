/* eslint-disable max-len */
import { ButtonGroup, Col, Container, Row, Text, Title } from '@dataesr/react-dsfr';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Error500() {
  return (
    <>
      <Title as="h1" look="h1">Erreur inattendue</Title>
      <Text size="sm" className="fr-mb-3w">Erreur 500</Text>
      <Text size="lead" className="fr-mb-3w">Essayez de rafraîchir la page ou bien réessayez plus tard.</Text>
      <Text size="sm" className="fr-mb-5w">
        Désolé, le service rencontre un problème, nous travaillons pour le résoudre le plus rapidement possible.
      </Text>
    </>
  );
}
function Error404() {
  return (
    <>
      <Title as="h1" look="h1">Page non trouvée</Title>
      <Text size="sm" className="fr-mb-3w">Erreur 404</Text>
      <Text size="lead" className="fr-mb-3w">La page que vous cherchez est introuvable. Excusez-nous pour la gêne occasionnée.</Text>
      <Text size="sm" className="fr-mb-5w">
        Si vous avez tapé l'adresse web dans le navigateur, vérifiez qu'elle est correcte. La page n'est peut-être plus disponible.
        <br />
        Dans ce cas, pour continuer votre visite, vous pouvez consulter notre page d'accueil, ou effectuer une recherche avec notre moteur de recherche en haut de page.
        <br />
        Sinon contactez-nous pour que l'on puisse vous rediriger vers la bonne information.
      </Text>
    </>
  );
}

export default function Error({ status }) {
  return (
    <Container>
      <Row gutters alignItems="center" justifyContent="middle" spacing="my-7w mt-md-12w mb-md-10w">
        <Col spacing="py-0" n="12 md-6">
          {['400', '404', '403', '401'].includes(status) ? <Error404 /> : <Error500 />}
          <ButtonGroup isInlineFrom="sm">
            <li>
              <Link className="fr-btn fr-btn--primary" to="/">
                Retour à l'accueil
              </Link>
            </li>
            <li>
              <Link className="fr-btn fr-btn--secondary" to="/nous-contacter">
                Contactez-nous
              </Link>
            </li>
          </ButtonGroup>
        </Col>
        <Col spacing="px-6w px-md-0 py-0" offset="md-1" n="12 md-3">
          <svg xmlns="http://www.w3.org/2000/svg" xmlSpace="preserve" viewBox="0 0 80 80">
            <g className="fr-artwork-decorative" id="artwork-decorative" fill="#cacafb">
              <path d="M68 13c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM41 76c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM15 10c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
            </g>
            <g className="fr-artwork-minor" id="artwork-minor" fill="#e1000f">
              <path d="M16 22c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm4 0c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm3-1c0 .6.4 1 1 1s1-.4 1-1-.4-1-1-1-1 .4-1 1zm39-1c.6 0 1 .4 1 1 0 .5-.4.9-.9 1H32c-.6 0-1-.4-1-1 0-.5.4-.9.9-1H62zM51.3 49.7c-.2.4-.3.8-.3 1.3 0 1.7 1.3 3 3 3s3-1.3 3-3c0-.6-.2-1.2-.5-1.7l4.3-5.7.1-.1c.2-.4.1-1-.3-1.3-.4-.3-1.1-.2-1.4.2l-4.3 5.7c-.3-.1-.6-.1-.9-.1-.5 0-.9.1-1.3.3l-2-2-.1-.1c-.4-.3-1-.3-1.3.1-.4.4-.4 1 0 1.4l2 2zm2.7.3c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z" />
            </g>
            <g className="fr-artwork-major" id="artwork-major" fill="#000091">
              <path d="M67 16.9c-.1-.5-.5-.9-1-.9H11.9c-.5.1-.9.5-.9 1v46.1c.1.5.5.9 1 .9h24.1c.5-.1.9-.5.9-1v-.1c-.1-.5-.5-.9-1-.9H13V26h37.1c.5-.1.9-.5.9-1 0-.6-.4-1-1-1H13v-6h52v15.1c.1.5.5.9 1 .9.6 0 1-.4 1-1V16.9zM71 51c0-9.4-7.6-17-17-17s-17 7.6-17 17c0 8.6 6.4 15.7 14.7 16.9l-.4.4-.1.1c-.3.4-.3 1 .1 1.3.4.4 1 .4 1.4 0l2-2 .1-.1c.1-.1.1-.2.1-.2 0-.1.1-.2.1-.3V67c0-.1 0-.3-.1-.4 0-.1-.1-.2-.2-.3l-2-2-.1-.1c-.4-.3-1-.3-1.3.1l-.1.1c-.3.4-.3 1 .1 1.3l.1.1C44.3 64.5 39 58.4 39 51c0-8.3 6.7-15 15-15s15 6.7 15 15c0 3.5-1.2 6.8-3.4 9.5-.3.4-.3 1.1.1 1.4s1.1.3 1.4-.1C69.6 58.7 71 55 71 51zm-6.4 13.3c.4-.3.5-1 .2-1.4-.3-.4-1-.5-1.4-.2-.6.5-1.2.9-1.9 1.3-.5.3-.6.9-.4 1.4.3.5.9.6 1.4.4.8-.5 1.5-1 2.1-1.5zm-8.4-24.1c-.7-.1-1.4-.2-2.2-.2-6.1 0-11 4.9-11 11s4.9 11 11 11 11-4.9 11-11c0-1.5-.3-3-.9-4.4-.2-.5-.8-.7-1.3-.5s-.7.8-.5 1.3c.5 1.1.7 2.3.7 3.6 0 5-4 9-9 9s-9-4-9-9 4-9 9-9c.6 0 1.2.1 1.8.2.5.1 1.1-.2 1.2-.8s-.2-1.1-.8-1.2zM38 32c.6 0 1 .4 1 1 0 .5-.4.9-.9 1H20c-.6 0-1-.4-1-1 0-.5.4-.9.9-1H38zm-3 7c0-.6-.4-1-1-1H19.9c-.5.1-.9.5-.9 1 0 .6.4 1 1 1h14.1c.5-.1.9-.5.9-1zm-3 5c.6 0 1 .4 1 1 0 .5-.4.9-.9 1H20c-.6 0-1-.4-1-1 0-.5.4-.9.9-1H32z" />
            </g>
          </svg>
        </Col>
      </Row>
    </Container>
  );
}

Error.propTypes = {
  status: PropTypes.string.isRequired,
};
