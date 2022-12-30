import { Icon, Row, Text } from '@dataesr/react-dsfr';
import Button from '../button';

import './folder-row.scss';

export default function FolderRow() {
  return (
    <Row spacing="px-1w py-1v" alignItems="middle" className="fullwidth hoverable">
      <Icon name="ri-folder-fill" size="2x" color="#d5706f" />
      <Text className="fr-m-0">image_name.jpg</Text>
      <Text className="fr-m-0" size="xs">343 KB</Text>
      <Button className="fr-ml-auto" rounded borderless tertiary color="text" icon="ri-download-line" />
    </Row>
  );
}
