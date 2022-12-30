import {
  Link as RouterLink,
  useNavigate,
} from 'react-router-dom';
import {
  Badge,
  Header as HeaderWrapper,
  HeaderBody,
  Logo,
  Service,
  Tool,
  ToolItem,
  ToolItemGroup,
} from '@dataesr/react-dsfr';
import useAuth from '../hooks/useAuth';

const {
  APP_HEADER_TAG: headerTag,
  APP_HEADER_TAG: headerTagColor,
} = import.meta.env;

export default function Header() {
  const { viewer, signout } = useAuth();
  const navigate = useNavigate();

  return (
    <HeaderWrapper>
      <HeaderBody>
        <Logo splitCharacter={9}>
          Ministère de l'enseignement supérieur et de la recherche
        </Logo>
        <Service
          title={(
            <>
              Cartable
              {headerTag && <Badge text={headerTag} type={(!headerTagColor) ? 'info' : undefined} isSmall colorFamily={headerTagColor} />}
            </>
          )}
          description="Bac de partage de fichiers du département d'outils d'aide à la décision"
        />
        <Tool closeButtonLabel="fermer" className="extend">
          <ToolItemGroup>
            {viewer._id ? (
              <ToolItem icon="ri-user-3-line">
                {viewer.email}
              </ToolItem>
            ) : (
              <ToolItem
                icon="ri-user-3-line"
                asLink={<RouterLink to="/se-connecter" />}
              >
                Se connecter
              </ToolItem>
            )}
            {viewer._id && (
              <ToolItem
                icon="ri-logout-circle-r-line"
                onClick={() => {
                  signout();
                  navigate('/');
                }}
              >
                Déconnexion
              </ToolItem>
            )}
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
    </HeaderWrapper>
  );
}
