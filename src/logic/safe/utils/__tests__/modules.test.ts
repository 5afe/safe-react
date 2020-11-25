import { SENTINEL_ADDRESS } from 'src/logic/contracts/safeContracts'
import { buildModulesLinkedList } from 'src/logic/safe/utils/modules'

describe('modules -> buildModulesLinkedList', () => {
  let moduleManager

  beforeEach(() => {
    moduleManager = {
      modules: {
        [SENTINEL_ADDRESS]: SENTINEL_ADDRESS,
      },
      enableModule: function (module: string) {
        this.modules[module] = this.modules[SENTINEL_ADDRESS]
        this.modules[SENTINEL_ADDRESS] = module
      },
      disableModule: function (prevModule: string, module: string) {
        this.modules[prevModule] = this.modules[module]
        this.modules[module] = '0x0'
      },
      getModules: function (): string[] {
        const modules: string[] = []
        let module: string = this.modules[SENTINEL_ADDRESS]

        while (module !== SENTINEL_ADDRESS) {
          modules.push(module)
          module = this.modules[module]
        }

        return modules
      },
    }
  })

  it(`should build a collection of addresses pair associated to a linked list`, () => {
    // Given
    const listOfModules = ['0xa', '0xb', '0xc', '0xd', '0xe', '0xf']

    // When
    const modulesPairList = buildModulesLinkedList(listOfModules)

    // Then
    expect(modulesPairList).toStrictEqual([
      [SENTINEL_ADDRESS, '0xa'],
      ['0xa', '0xb'],
      ['0xb', '0xc'],
      ['0xc', '0xd'],
      ['0xd', '0xe'],
      ['0xe', '0xf'],
    ])
  })

  it(`should properly provide a list of modules pair to remove an specified module`, () => {
    // Given
    moduleManager.enableModule('0xc')
    moduleManager.enableModule('0xb')
    moduleManager.enableModule('0xa') // returned list is ordered [0xa, 0xb, 0xc]
    const modulesPairList = buildModulesLinkedList(moduleManager.getModules())

    // When
    const moduleBPair = modulesPairList?.[1] ?? []
    moduleManager.disableModule(...moduleBPair)

    // Then
    expect(moduleManager.modules['0xb']).toBe('0x0')
    expect(moduleManager.getModules()).toStrictEqual(['0xa', '0xc'])
    expect(buildModulesLinkedList(moduleManager.getModules())).toStrictEqual([
      [SENTINEL_ADDRESS, '0xa'],
      ['0xa', '0xc'],
    ])
  })

  it(`should properly provide a list of modules pair to remove the firstly added module`, () => {
    // Given
    moduleManager.enableModule('0xc')
    moduleManager.enableModule('0xb')
    moduleManager.enableModule('0xa') // returned list is ordered [0xa, 0xb, 0xc]
    const modulesPairList = buildModulesLinkedList(moduleManager.getModules())

    // When
    const moduleBPair = modulesPairList?.[2] ?? []
    moduleManager.disableModule(...moduleBPair)

    // Then
    expect(moduleManager.modules['0xc']).toBe('0x0')
    expect(moduleManager.getModules()).toStrictEqual(['0xa', '0xb'])
    expect(buildModulesLinkedList(moduleManager.getModules())).toStrictEqual([
      [SENTINEL_ADDRESS, '0xa'],
      ['0xa', '0xb'],
    ])
  })

  it(`should properly provide a list of modules pair to remove the lastly added module`, () => {
    // Given
    moduleManager.enableModule('0xc')
    moduleManager.enableModule('0xb')
    moduleManager.enableModule('0xa') // returned list is ordered [0xa, 0xb, 0xc]
    const modulesPairList = buildModulesLinkedList(moduleManager.getModules())

    // When
    const moduleBPair = modulesPairList?.[0] ?? []
    moduleManager.disableModule(...moduleBPair)

    // Then
    expect(moduleManager.modules['0xa']).toBe('0x0')
    expect(moduleManager.getModules()).toStrictEqual(['0xb', '0xc'])
    expect(buildModulesLinkedList(moduleManager.getModules())).toStrictEqual([
      [SENTINEL_ADDRESS, '0xb'],
      ['0xb', '0xc'],
    ])
  })
})
