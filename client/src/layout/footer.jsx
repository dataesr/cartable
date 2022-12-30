import { Link as RouterLink, NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Footer as FooterWrapper,
  FooterBody,
  FooterBottom,
  FooterBodyItem,
  FooterLink,
  Link,
  Logo,
  Icon,
} from '@dataesr/react-dsfr';
import useAuth from '../hooks/useAuth';

export default function Footer({ switchTheme }) {
  const { viewer } = useAuth();
  const { isOpen, setIsOpen } = switchTheme;

  return (
    <FooterWrapper className="fr-mt-8w">
      <FooterBody description="Cartable : Bac de partage de fichiers du département d'outils d'aide à la décision">
        <Logo
          asLink={<Link href="https://www.enseignementsup-recherche.gouv.fr/fr" />}
          splitCharacter={9}
        >
          Ministère de l‘enseignement supérieur et de la recherche
        </Logo>
        <FooterBodyItem>
          <Link target="_blank" href="https://legifrance.gouv.fr">
            legifrance.gouv.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link target="_blank" href="https://gouvernement.fr">
            gouvernement.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link target="_blank" href="https://service-public.fr">
            service-public.fr
          </Link>
        </FooterBodyItem>
        <FooterBodyItem>
          <Link target="_blank" href="https://data.gouv.fr">data.gouv.fr</Link>
        </FooterBodyItem>
      </FooterBody>
      {viewer._id && (
        <FooterBottom>
          <FooterLink asLink={<RouterLink to="/aide" />}>
            Aide
          </FooterLink>
          <FooterLink asLink={<RouterLink to="/nous-contacter" />}>
            Nous contacter
          </FooterLink>
          <FooterLink href="#">
            Mentions légales
          </FooterLink>
          <FooterLink asLink={<Link href="https://github.com/orgs/dataesr/repositories?q=cartable&type=&language=&sort=" target="_blank" />}>
            Github
          </FooterLink>
          <FooterLink target="_blank" href={`https://github.com/dataesr/cartable/releases/tag/v${import.meta.env.VITE_APP_VERSION}`}>
            {`Version de l'application v${import.meta.env.VITE_APP_VERSION}`}
          </FooterLink>
          <FooterLink>
            <button
              onClick={() => setIsOpen(true)}
              type="button"
              className="fr-footer__bottom-link fr-fi-theme-fill fr-link--icon-left"
              aria-controls="fr-theme-modal"
              data-fr-opened={isOpen}
            >
              Paramètres d'affichage
            </button>
          </FooterLink>
          {(viewer.role === 'admin') && (
            <FooterLink asLink={<NavLink to="/admin/utilisateurs" />}>
              <Icon size="lg" name="ri-user-settings-line" />
              {' '}
              Administration des utilisateurs
            </FooterLink>
          )}
        </FooterBottom>
      )}
    </FooterWrapper>
  );
}

Footer.propTypes = {
  switchTheme: PropTypes.shape({
    isOpen: PropTypes.bool,
    setIsOpen: PropTypes.func,
  }).isRequired,
};
