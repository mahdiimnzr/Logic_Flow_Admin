// ** Icons Imports
import { Award } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardBody, CardText } from 'reactstrap'

// ** Images
import decorationLeft from '../../assets/images/elements/decore-left.png'
import decorationRight from '../../assets/images/elements/decore-right.png'

const CardCongratulations = ({ name = 'کاربر', number = '0' }) => {
  return (
    <Card className='card-congratulations'>
      <CardBody className='text-center'>
        <img className='congratulations-img-left' src={decorationLeft} alt='decor-left' />
        <img className='congratulations-img-right' src={decorationRight} alt='decor-right' />
        <Avatar icon={<Award size={28} />} className='shadow' color='primary' size='xl' />
        <div className='text-center'>
          <h1 className='mb-1 text-white'>تبریک می‌گوییم {name}،</h1>
          <CardText className='m-auto w-75'>
           تعداد دوره های خریداری شده شما {number} می‌باشد. اطلاعات بیشتر را دریافت کنید. 
          </CardText>
        </div>
      </CardBody>
    </Card>
  )
}

export default CardCongratulations
