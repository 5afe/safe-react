import { calculateValuesAfterRemoving } from 'src/routes/open/components/SafeOwnersConfirmationsForm'

describe('calculateValuesAfterRemoving', () => {
  it(`should properly remove the last owner row`, () => {
    // Given
    const formContent = {
      name: 'My Safe',
      owner0000Name: 'Owner 0',
      owner0000Address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      owner0001Name: 'Owner 1',
      owner0001Address: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
    }

    // When
    const newFormContent = calculateValuesAfterRemoving(1, formContent)

    // Then
    expect(newFormContent).toStrictEqual({
      name: 'My Safe',
      owner0000Name: 'Owner 0',
      owner0000Address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
    })
  })

  it(`should properly remove an owner and recalculate fields indices`, () => {
    // Given
    const formContent = {
      name: 'My Safe',
      owner0000Name: 'Owner 0',
      owner0000Address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      owner0001Name: 'Owner 1',
      owner0001Address: '0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0',
      owner0002Name: 'Owner 2',
      owner0002Address: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
    }

    // When
    const newFormContent = calculateValuesAfterRemoving(1, formContent)

    // Then
    expect(newFormContent).toStrictEqual({
      name: 'My Safe',
      owner0000Name: 'Owner 0',
      owner0000Address: '0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1',
      owner0001Name: 'Owner 2',
      owner0001Address: '0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b',
    })
  })
})
