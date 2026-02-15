import React from 'react'
import { Row, Col, Input, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

const PaymentFilters = ({
  fromDate,
  setFromDate,
  toDate,
  setToDate,
  searchTerm,
  setSearchTerm,
  applyFilters,
  resetFilters,
}) => {
  return (
    <div style={{ padding: '16px', borderBottom: '1px solid #eee' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Filters</h3>

      <Row gutter={[16, 16]} align="bottom">
        {/* From Date */}
        <Col xs={24} sm={12} md={6}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>From Date</label>
          <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </Col>

        {/* To Date */}
        <Col xs={22} sm={12} md={6}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>To Date</label>
          <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </Col>

        {/* Search */}
        <Col xs={22} sm={22} md={6}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Search</label>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name, email, etc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>

        {/* Buttons */}
        <Col xs={22} sm={22} md={6}>
          <div
            style={{
              display: 'flex',
              gap: '10px',
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
            }}
          >
            <Button type="primary" onClick={applyFilters}>
              Apply
            </Button>
            <Button onClick={resetFilters}>Reset</Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default PaymentFilters
