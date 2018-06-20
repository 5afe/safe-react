// @flow
import { XMLHttpRequest } from 'xmlhttprequest'

jest.setTimeout(45000)
global.XMLHttpRequest = new XMLHttpRequest()
