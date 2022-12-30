import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, TextInput, Text, Link, Title, ButtonGroup, Alert,
} from '@dataesr/react-dsfr';
import Button from '../components/button';
import useAuth from '../hooks/useAuth';
import { MAIL_REGEXP, PASSWORD_REGEXP, OTP_REGEXP } from '../utils/auth';
import usePageTitle from '../hooks/usePageTitle';
import useForm from '../hooks/useForm';

const validate = (body) => {
  const errors = {};
  if (!body.email || !MAIL_REGEXP.test(body.email)) { errors.email = 'Veuillez entrer un adresse email valide'; }
  if (!body.password || !PASSWORD_REGEXP.test(body.password)) { errors.password = 'Mot de passe invalide'; }
  if (!body.otp || !OTP_REGEXP.test(body.otp)) { errors.otp = 'Le code doit contenir 6 chiffres'; }
  return errors;
};

export default function SignIn() {
  usePageTitle('Se connecter');
  const navigate = useNavigate();
  const { signin } = useAuth();
  const [step, setStep] = useState(1);
  const { form, updateForm, errors } = useForm({}, validate);
  const [error, setError] = useState(null);
  const [showErrors, setShowErrors] = useState(null);

  const handleSignin = async (e) => {
    e.preventDefault();
    if ((step === 1) && Object.keys(errors).includes('email')) return setShowErrors(true);
    if ((step === 1) && Object.keys(errors).includes('password')) return setShowErrors(true);
    if ((step === 2) && Object.keys(errors).includes('otp')) return setShowErrors(true);
    const response = await signin(form);
    if (response.status === 202) { setError(''); return setStep(2); }
    if (response.status === 200) { return navigate('/'); }
    return setError(response?.error || response?.message);
  };

  return (
    <Container spacing="my-6w">
      <Row justifyContent="center">
        <Col n="xs-12 sm-10 md-8 lg-6">
          <Title as="h1" look="h3">
            Ouvrir mon
            {' '}
            {import.meta.env.VITE_APP_NAME}
          </Title>
        </Col>
      </Row>
      <Container fluid>
        <Row justifyContent="center">
          <Col n="xs-12 sm-10 md-8 lg-6">
            <Container fluid className="fr-background-alt" spacing="px-4w px-md-6w py-4w">
              {(step === 1) && (
                <Row justifyContent="center">
                  <Col>
                    {(error) && <Alert description={error} type="error" />}
                    <form onSubmit={handleSignin}>
                      <TextInput
                        required
                        label="Adresse email"
                        value={form.email}
                        onChange={(e) => updateForm({ email: e.target.value })}
                        messageType={(showErrors && errors.email) ? 'error' : ''}
                        message={(showErrors && errors.email) ? errors.email : null}
                      />
                      <TextInput
                        required
                        label="Mot de passe"
                        value={form.password}
                        onChange={(e) => updateForm({ password: e.target.value })}
                        type="password"
                        spacing="mb-1v"
                        messageType={(showErrors && errors.email) ? 'error' : ''}
                        message={(showErrors && errors.email) ? errors.email : null}
                      />
                      <Link size="sm" as={<RouterLink to="/mot-de-passe-oublie" />}>
                        Mot de passe oublié ?
                      </Link>
                      <Row spacing="my-2w">
                        <Col>
                          <ButtonGroup>
                            <Button submit>
                              Valider
                            </Button>
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </form>
                    <hr />
                    <Row spacing="my-2w">
                      <Col n="12">
                        <Text bold size="lg">Première connexion ?</Text>
                      </Col>
                      <Col n="12">
                        <ButtonGroup>
                          <Button as="a" secondary onClick={() => navigate('/activer-mon-compte')}>
                            Activer mon compte
                          </Button>
                        </ButtonGroup>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}
              {(step === 2) && (
                <Row justifyContent="center">
                  <Col>
                    {(error) && <Alert description={error} type="error" />}
                    <form onSubmit={handleSignin}>
                      <TextInput
                        required
                        label="Saisissez le code à 6 chiffres reçu par email"
                        value={form.otp}
                        onChange={(e) => updateForm({ otp: e.target.value.trim() })}
                        messageType={(showErrors && errors.otp) ? 'error' : ''}
                        message={(showErrors && errors.otp) ? errors.otp : null}
                      />
                      <Row spacing="my-2w">
                        <Col>
                          <ButtonGroup>
                            <Button submit>
                              Se connecter
                            </Button>
                          </ButtonGroup>
                        </Col>
                      </Row>
                      <Text>
                        Si vous n'avez pas reçu un email après 5 minutes,
                        <Link href="/se-connecter"> cliquez ici.</Link>
                      </Text>
                    </form>
                  </Col>
                </Row>
              )}
            </Container>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
