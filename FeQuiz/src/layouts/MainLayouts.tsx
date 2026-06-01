import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function MainLayouts() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <Header/>
      <main style={{ flex: 1, width: '100%' }}>
        <Outlet/>
      </main>
      <Footer/>
    </div>
  )
}
