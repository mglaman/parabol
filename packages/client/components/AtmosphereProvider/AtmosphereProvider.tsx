import React, {Component, ReactNode} from 'react'
import Atmosphere from '../../Atmosphere'
import TLocalAtmosphere from '../../modules/demo/LocalAtmosphere'

export const AtmosphereContext = React.createContext<Atmosphere | TLocalAtmosphere | undefined>(
  undefined
)

interface Props {
  children: ReactNode
  // LocalAtmosphere has a bunch of junk we don't want to SSR, so we have client-only files pass it in
  getLocalAtmosphere?: () => Promise<{default: {new (): TLocalAtmosphere}}>
}

class AtmosphereProvider extends Component<Props> {
  atmosphere?: Atmosphere | TLocalAtmosphere

  constructor(props) {
    super(props)
    if (props.getLocalAtmosphere) {
      this.loadDemo().catch()
    } else {
      this.atmosphere = new Atmosphere()
      this.atmosphere.getAuthToken(window)
    }
  }

  async loadDemo() {
    const LocalAtmosphere = await this.props.getLocalAtmosphere!()
      .then((mod) => mod.default)
      .catch()
    this.atmosphere = new LocalAtmosphere()
    this.forceUpdate()
  }

  render() {
    if (!this.atmosphere) return null
    return (
      <AtmosphereContext.Provider value={this.atmosphere}>
        {this.props.children}
      </AtmosphereContext.Provider>
    )
  }
}

export default AtmosphereProvider
