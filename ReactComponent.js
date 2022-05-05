import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import withStyles from 'react-jss';
import {
  Grid, Text, Modal, grid,
  Flexbox, TextField,
} from '@occmundial/occ-atomic';
import windowSize from '../../common/useWindowSize';
import {
  Amex, Visa, MasterCard,
} from '../../atoms/svg';
import styles from './styles';
import { Space } from '../../molecules';
import { spaceType } from '../../molecules/space';

const {
  publicRuntimeConfig: { creditCardTypes },
} = getConfig();

const creditCardProps = {
  width: '44px',
  height: '32px',
};

const CVVModal = ({
  classes, showModal, setShowModal, cardType, cardNumber, cardCvvVal, onClickSaveCvv,
}) => {
  const [newCVV, setNewCVV] = useState(cardCvvVal);
  const [isMobile, toggleMobile] = useState(true);
  const { width } = windowSize();
  const [errors, setErrors] = useState(false);

  const onChangeCardCVV = (cardCVV) => {
    const cvvClean = cardCVV.replace(/([/_])+/g, '');
    const error = cardType === creditCardTypes.AMEX ? cvvClean.length !== 4 : cvvClean.length !== 3;
    setNewCVV(cardCVV);
    setErrors(error);
  };

  const saveCVV = () => {
    onClickSaveCvv(newCVV);
    setNewCVV('');
  };

  const onChangeCardEnter = (value) => {
    if (value === 13) {
      saveCVV();
    }
  };

  useEffect(() => {
    toggleMobile(width < grid.md);
  }, [width]);
  return (
    <Modal
      show={showModal}
      title="Verificación de datos"
      fullSize
      onClose={() => { setShowModal(false); setNewCVV(''); }}
      container={typeof window !== 'undefined' ? document.body : null}
      mainBtn={{
        text: 'Guardar',
        onClick: () => saveCVV(),
        disabled: errors,
      }}
    >
      <Grid.Row className={styles.row}>
        <Grid.Col>
          <Text>
            Para proteger tu tarjeta por cargos sin tu autorización, requerimos ingreses el CVV. Nosotros NO guardamos esta información en tu cuenta.
          </Text>
        </Grid.Col>
      </Grid.Row>
      <Space type={spaceType.personalizado} desk={16} movil={16} />
      <Flexbox display="flex" justifyContent="between" direction={isMobile ? 'col' : 'row'}>
        <div>
          <Text>CVV</Text>
          <TextField
            mask={cardType === creditCardTypes.AMEX ? [/\d/, /\d/, /\d/, /\d/] : [/\d/, /\d/, /\d/]}
            placeholder={cardType === creditCardTypes.AMEX ? '0000' : '000'}
            onChange={onChangeCardCVV}
            onKeyUp={value => onChangeCardEnter(value, newCVV)}
            valueProp={newCVV}
            error={errors}
            autoFocus
          />
        </div>
        <div>
          <Space type={spaceType.personalizado} desk={24} movil={24} />
          <Flexbox display="flex">
            {
              cardType === creditCardTypes.AMEX && <Amex {...creditCardProps} iconClass={classes.alignsAddNewCard} />
            }
            {
              cardType === creditCardTypes.VISA && <Visa {...creditCardProps} iconClass={classes.alignsAddNewCard} />
            }
            {
              cardType === creditCardTypes.MASTERCARD && <MasterCard {...creditCardProps} iconClass={classes.alignsAddNewCard} />
            }
            <Text subheading className={classes.cardNumber}>{cardNumber}</Text>
          </Flexbox>
        </div>
      </Flexbox>
      <Space type={spaceType.personalizado} desk={16} movil={16} />
      <Grid.Row>
        <Grid.Col
          md={{ col: 6 }}
          sm={{ col: 6 }}
          xs={{ col: 6 }}
        >
          {errors && <Text error>Por favor, revisa tus datos.</Text>}
        </Grid.Col>
      </Grid.Row>
    </Modal>
  );
};
CVVModal.propTypes = {
  classes: PropTypes.object.isRequired,
  showModal: PropTypes.bool,
  setShowModal: PropTypes.func.isRequired,
  onClickSaveCvv: PropTypes.func.isRequired,
  cardType: PropTypes.string.isRequired,
  cardNumber: PropTypes.string.isRequired,
  cardCvvVal: PropTypes.string.isRequired,
};

CVVModal.defaultProps = {
  showModal: false,
};

export default withStyles(styles)(CVVModal);