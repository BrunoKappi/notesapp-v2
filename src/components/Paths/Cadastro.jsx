import React, { useState, useEffect } from 'react'
import './css/Cadastro.css'
import { connect } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { uuidv4 } from '@firebase/util'
import Select from 'react-select'
import { Mail, User, Settings, Building2, MapPin, Calendar, Phone } from "lucide-react";
import { CreateUsuario, SairUmaPagina } from '../utils/Utilidades'
import { MaxDateNascimento, MaxLengthEmail, MaxLengthApelido, MaxLengthNome, MinDateNascimento } from '../../GlobalVars';
import PhoneInput from 'react-phone-input-2'
import { Estados } from '../../Cidades';

const Cadastro = (props) => {

    const navigate = useNavigate(); 

    const [Email, setEmail] = useState(props.LoggedUser.email || '');
    const [Nome, setNome] = useState('');
    const [Sobrenome, setSobrenome] = useState('');
    const [Cidade, setCidade] = useState('');
    const [Estado, setEstado] = useState('');
    const [Nascimento, setNascimento] = useState('');
    const [Apelido, setApelido] = useState('');
    const [Mensagem, setMensagem] = useState('');
    const [Filled, setFilled] = useState(false);
    const [Telefone, setTelefone] = useState('');
    const [EstadosOpcoes, setEstadosOpcoes] = useState([]);
    const [CidadesOpcoes, setCidadesOpcoes] = useState([]);

    useEffect(() => {
        setEmail(props.LoggedUser.email)
        if (props.LoggedUser.email !== 'Vazio' && props.Usuario)
            navigate('/App/Notas')
        if (Email && Nome && Sobrenome && Cidade && Estado && Nascimento  && Telefone.length >= 10)
            setFilled(true)
        else
            setFilled(false)
    }, [props.LoggedUser.email, props.Usuario, navigate, Filled, Email, Nome, Sobrenome, Cidade, Estado, Nascimento, Telefone]);

    const HandleSubmitCadastro = async (e) => {
        e.preventDefault()
        if (Filled) {
            if (Nome) {
                const UsuarioNovo = {
                    uid: uuidv4(),
                    email: props.LoggedUser.email,
                    nome: Nome,
                    cidade: Cidade,
                    estado: Estado,
                    sobrenome: Sobrenome,
                    nascimento: Nascimento,
                    apelido: Apelido || ' ',
                    numero: Telefone
                }
                CreateUsuario(UsuarioNovo)
                setMensagem('Atualizado')
                navigate('/App/Notas')
            }
        }
    }



    useEffect(() => {
        setEstadosOpcoes(Estados.map(Estado => { return { value: Estado.nome, label: Estado.nome } }))
    }, []);

    useEffect(() => {
        if (Estado) {
            setCidade('')
            const EstadoEscolhido = Estados.find(EstadoMap => { return EstadoMap.nome === Estado })
            setCidadesOpcoes(EstadoEscolhido.cidades.map(Cidade => { return { value: Cidade, label: Cidade } }))
        }
    }, [Estado]);



    return (
        <div className='DivCadastroForm'>
            <div className='formContainerCadastro'>
                {Mensagem && <p className='Mensagem'>{Mensagem}</p>}
                <form onSubmit={HandleSubmitCadastro} className="CadastroForm">
                    <h1>Termine Seu Cadastro</h1>
                    <label className='InputLabelProfile' >  <Mail size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Email</label>
                    <input maxLength={MaxLengthEmail} name="Email" disabled className='CadastroInput' type="text" defaultValue={Email} />

                    <label className='InputLabelProfile' ><User size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Nome</label>
                    <div className='DoubleColumnCadastro'>
                        <input maxLength={MaxLengthNome} name='Nome' className='CadastroInput' type="text" placeholder='Nome' onChange={e => setNome(e.target.value)} />
                        <input maxLength={MaxLengthNome} name='Sobrenome' className='CadastroInput' type="text" placeholder='Sobrenome' onChange={e => setSobrenome(e.target.value)} />
                    </div>



                    <label className='InputLabelProfile' > <Phone size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> Telefone de Contato</label>

                    <PhoneInput
                        inputStyle={{ width: '100%', marginRight: '0', fontFamily: 'Kanit', fontSize: '12px' }}
                        containerStyle={{ margin: '0', padding: '0', width: '100%', fontSize: '12px' }}
                        country={'br'}
                        value={Telefone}
                        onChange={e => setTelefone(e)}
                    />

                    <div className='DoubleColumnCadastro'>
                        <div className='ColunaDoubleRow'>
                            <label className='InputLabelProfile' ><Calendar size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Data de Nascimento</label>
                            <input min={MinDateNascimento} max={MaxDateNascimento} placeholder='Data' name="Nascimento" className='CadastroInput NascimentoSelect' type="date" onChange={e => setNascimento(e.target.value)} />
                        </div>

                        <div className='ColunaDoubleRow'>
                            <label className='InputLabelProfile' ><Settings size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Apelido</label>
                            <input maxLength={MaxLengthApelido} value={Apelido} className='CadastroInput EmpresaInput ' placeholder='Apelido(Opcional)' type="text" name='Apelido' onChange={e => setApelido(e.target.value)} />
                        </div>

                    </div>



                    <div className='DoubleColumnCadastro'>
                        <div className='ColunaDoubleRow'>
                            <label className='InputLabelProfile' > <MapPin size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Estado</label>
                            <Select
                                maxMenuHeight='120px'
                                menu={{ heigth: '50px' }}
                                className='Select'
                                name='Estado'
                                options={EstadosOpcoes}
                                onChange={e => setEstado(e.value)}>
                            </Select>
                        </div>

                        <div className='ColunaDoubleRow'>
                            <label className='InputLabelProfile' >  <Building2 size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Cidade</label>
                            <Select
                                maxMenuHeight='120px'
                                className='Select'
                                name='Cidade'
                                options={CidadesOpcoes}
                                onChange={e => setCidade(e.value)}>
                            </Select>
                        </div>

                    </div>


                    <button disabled={!Filled} className='CadastroButton'>Enviar</button>

                </form>
                <a className="BackLogout" href="/" onClick={SairUmaPagina}>Voltar</a>
            </div>
        </div>
    )
}

const ConnectedCadastro = connect((state) => {
    return {
        LoggedUser: state.LoggedUser,
        Usuario: state.Usuarios.find(Usuario => {
            return Usuario.email === state.LoggedUser.email
        }),
        Dados: state.Dados
    }
})(Cadastro)

export default ConnectedCadastro