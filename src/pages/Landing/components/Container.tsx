import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 70px 80px;

  @media screen and (max-width: 1080px) {
    padding: 30px 40px;
  }

  @media screen and (max-width: 860px) {
    padding: 30px 20px;
  }
`

export default Container
