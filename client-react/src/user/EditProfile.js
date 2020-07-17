import React from 'react'
import { Button, Form, Header } from 'semantic-ui-react'

export default function (props) {
  console.log(props, 'Props from Edit Settings')
  return (
    <div>
      <Header as='h1'>User Profile</Header>
      <Form id='profileForm'>
        <Form.Field>
          <label>First Name</label>
          {props.profileData.first_name ? <input id='Fname' value={props.profileData.first_name} /> : <input id='Fname' placeholder='First Name' />}
        </Form.Field>
        <Form.Field>
          <label>Last Name</label>
          {props.profileData.last_name ? <input id='Lname' value={props.profileData.last_name} /> : <input id='Lname' placeholder='Last Name' />}
        </Form.Field>
        <Form.Field>
          <label>Job Title</label>
          {props.profileData.job_title ? <input id='job_title' value={props.profileData.job_title} /> : <input id='job_title' placeholder='Job Title' />}
        </Form.Field>
        <Form.Field>
          <label>City</label>
          {props.profileData.city ? <input id='city' value={props.profileData.city} /> : <input id='city' placeholder='City' />}
        </Form.Field>
        <Form.Field>
          <label>County</label>
          {props.profileData.county ? <input id='county' value={props.profileData.county} /> : <input id='county' placeholder='County' />}
        </Form.Field>
        <Form.Field>
          <label>District</label>
          <input id='district' placeholder='District' />
          <span id='district' value='' />
        </Form.Field>
        <Button
          type='submit'
          content='Update'
          icon='right arrow'
          labelPosition='right'
          onClick={props.handleProfile}
          style={{ border: '1px black solid' }}
        />
      </Form>
    </div>
  )
}
